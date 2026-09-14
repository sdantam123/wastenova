# Data Models — Global Recycle

## Database: PostgreSQL 16

---

## Core Tables

### `users`
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id     VARCHAR(255) UNIQUE NOT NULL,  -- Apple/Google sub
  auth_provider   VARCHAR(20) NOT NULL,          -- 'apple' | 'google'
  name            VARCHAR(255),
  email           VARCHAR(255),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `jurisdictions`
Hierarchical geographic units with recycling program data.

```sql
CREATE TABLE jurisdictions (
  id              VARCHAR(100) PRIMARY KEY,
  -- e.g. 'jur_us_nj_hudson_jerseycity'
  country         VARCHAR(100) NOT NULL,
  country_code    CHAR(2) NOT NULL,
  state           VARCHAR(100),
  state_code      VARCHAR(10),
  county          VARCHAR(100),
  township        VARCHAR(100),
  postal_codes    TEXT[],
  parent_id       VARCHAR(100) REFERENCES jurisdictions(id),
  -- Inherit rules from parent when no specific rules exist
  data_source     VARCHAR(255),
  last_updated    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jurisdictions_country_state ON jurisdictions(country_code, state_code);
```

---

### `recycling_rules`
Material-level rules per jurisdiction.

```sql
CREATE TABLE recycling_rules (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction_id     VARCHAR(100) NOT NULL REFERENCES jurisdictions(id),
  material_name       VARCHAR(255) NOT NULL,
  material_code       VARCHAR(20),           -- e.g. '1', '2', 'HDPE', 'ALU'
  category            VARCHAR(50) NOT NULL,
  -- CURBSIDE | DROPOFF_CENTER | MEDICAL_DROPOFF | HAZARDOUS | COMPOST | NOT_RECYCLABLE | REUSE
  is_accepted         BOOLEAN NOT NULL DEFAULT true,
  preparation_steps   TEXT[],               -- ordered instructions
  rejection_reason    TEXT,                 -- if not accepted
  special_notes       TEXT,
  effective_from      DATE,
  effective_to        DATE,                 -- NULL = indefinite
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE (jurisdiction_id, material_name)
);

CREATE INDEX idx_rules_jurisdiction ON recycling_rules(jurisdiction_id);
CREATE INDEX idx_rules_category ON recycling_rules(category);
```

---

### `pickup_schedules`
Curbside collection schedules per jurisdiction.

```sql
CREATE TABLE pickup_schedules (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction_id     VARCHAR(100) NOT NULL REFERENCES jurisdictions(id),
  schedule_type       VARCHAR(50) NOT NULL,  -- RECYCLING | TRASH | YARD_WASTE | BULK_PICKUP
  frequency           VARCHAR(20) NOT NULL,  -- WEEKLY | BIWEEKLY | MONTHLY
  day_of_week         SMALLINT,              -- 0=Sun, 1=Mon ... 6=Sat
  week_of_month       SMALLINT,              -- for BIWEEKLY: 1, 3 or 2, 4
  accepted_materials  TEXT[],
  preparation_notes   TEXT,
  effective_from      DATE NOT NULL,
  effective_to        DATE,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

### `schedule_exceptions`
Holiday delays and one-time schedule changes.

```sql
CREATE TABLE schedule_exceptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  jurisdiction_id     VARCHAR(100) NOT NULL REFERENCES jurisdictions(id),
  exception_date      DATE NOT NULL,
  reason              VARCHAR(255),          -- e.g. 'Independence Day'
  new_date            DATE,                  -- replacement collection date
  cancelled           BOOLEAN DEFAULT FALSE, -- if collection skipped entirely
  created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

### `dropoff_centers`
Physical recycling centers and drop-off locations.

```sql
CREATE TABLE dropoff_centers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                VARCHAR(255) NOT NULL,
  center_type         VARCHAR(50) NOT NULL,
  -- COUNTY_CENTER | MUNICIPAL_CENTER | RETAIL_DROPOFF | PHARMACY_DROPBOX | EWASTE_EVENT
  program_name        VARCHAR(255),          -- e.g. 'DEA Drug Take-Back'
  address_line1       VARCHAR(255) NOT NULL,
  address_line2       VARCHAR(255),
  city                VARCHAR(100) NOT NULL,
  state               VARCHAR(100),
  postal_code         VARCHAR(20),
  country_code        CHAR(2) NOT NULL,
  latitude            DECIMAL(10, 7) NOT NULL,
  longitude           DECIMAL(10, 7) NOT NULL,
  phone               VARCHAR(30),
  website             VARCHAR(500),
  email               VARCHAR(255),
  accepted_materials  TEXT[] NOT NULL,       -- material names or categories
  not_accepted        TEXT[],
  is_active           BOOLEAN DEFAULT TRUE,
  is_temporary        BOOLEAN DEFAULT FALSE, -- for one-time events
  event_date          DATE,                  -- if temporary event
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- PostGIS spatial index for geo queries
CREATE INDEX idx_centers_location ON dropoff_centers USING GIST (
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
);
CREATE INDEX idx_centers_country ON dropoff_centers(country_code);
```

### `center_hours`
Operating hours per center.

```sql
CREATE TABLE center_hours (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id     UUID NOT NULL REFERENCES dropoff_centers(id) ON DELETE CASCADE,
  day_of_week   SMALLINT NOT NULL,  -- 0=Sun, 6=Sat
  open_time     TIME,               -- NULL = closed
  close_time    TIME,               -- NULL = closed
  notes         VARCHAR(255)        -- e.g. 'Drop-box accessible 24/7'
);
```

---

### `scan_history`
Stores user scan results for history and impact tracking.

```sql
CREATE TABLE scan_history (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jurisdiction_id VARCHAR(100) REFERENCES jurisdictions(id),
  scanned_at      TIMESTAMPTZ DEFAULT NOW(),
  image_key       VARCHAR(500),    -- ephemeral S3 key, TTL 1 hour, then deleted
  objects         JSONB NOT NULL,  -- full analysis result
  -- [{ name, material, category, recyclable, preparation_steps }]
  items_count     SMALLINT NOT NULL,
  recyclable_count SMALLINT NOT NULL
);

CREATE INDEX idx_history_user ON scan_history(user_id, scanned_at DESC);
```

---

### `user_notifications`
Notification preferences and scheduled reminders.

```sql
CREATE TABLE user_notifications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  jurisdiction_id     VARCHAR(100) REFERENCES jurisdictions(id),
  apns_token          VARCHAR(512),
  notify_recycling    BOOLEAN DEFAULT TRUE,
  notify_yard_waste   BOOLEAN DEFAULT TRUE,
  notify_bulk         BOOLEAN DEFAULT FALSE,
  reminder_time       TIME DEFAULT '20:00:00',  -- default 8 PM night before
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Redis Cache Keys

| Key Pattern | Value | TTL |
|---|---|---|
| `rules:{jurisdictionId}` | JSON: recycling rules | 24 hours |
| `schedule:{jurisdictionId}:{year}:{month}` | JSON: pickup dates | 24 hours |
| `centers:{lat}:{lng}:{radius}:{material}` | JSON: center list | 6 hours |
| `jurisdiction:{lat}:{lng}` | JSON: resolved jurisdiction | 7 days |
| `jurisdiction:postal:{code}:{country}` | JSON: resolved jurisdiction | 7 days |

---

## TypeScript Types (Backend / iOS shared schema)

```typescript
// Shared between backend responses and iOS Codable structs

type RecyclingCategory =
  | 'CURBSIDE'
  | 'DROPOFF_CENTER'
  | 'MEDICAL_DROPOFF'
  | 'HAZARDOUS'
  | 'COMPOST'
  | 'NOT_RECYCLABLE'
  | 'REUSE';

interface IdentifiedObject {
  id: string;
  name: string;
  material: string;
  materialCode?: string;
  recyclable: boolean;
  category: RecyclingCategory;
  preparationInstructions: string[];
  confidence: number; // 0.0 – 1.0
}

interface Jurisdiction {
  id: string;
  country: string;
  countryCode: string;
  state?: string;
  stateCode?: string;
  county?: string;
  township?: string;
  postalCode?: string;
}

interface PickupDay {
  date: string;           // ISO 8601
  type: string;           // RECYCLING | TRASH | YARD_WASTE
  materials: string[];
  notes?: string;
  isHolidayDelay: boolean;
}

interface DropoffCenter {
  id: string;
  name: string;
  centerType: string;
  address: string;
  distanceMiles: number;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  hours: CenterHours[];
  isOpenNow: boolean;
  acceptedMaterials: string[];
  notAccepted?: string[];
}

interface CenterHours {
  day: string;
  openTime?: string;   // "HH:mm"
  closeTime?: string;  // "HH:mm"
  notes?: string;
}
```

---

## Swift Codable Models (iOS)

```swift
// Mirrors TypeScript types above as Codable structs

struct AnalysisResponse: Codable {
    let analysisId: String
    let jurisdiction: Jurisdiction
    let objects: [IdentifiedObject]
}

struct IdentifiedObject: Codable, Identifiable {
    let id: String
    let name: String
    let material: String
    let materialCode: String?
    let recyclable: Bool
    let category: RecyclingCategory
    let preparationInstructions: [String]
    let confidence: Double
}

enum RecyclingCategory: String, Codable {
    case curbside         = "CURBSIDE"
    case dropoffCenter    = "DROPOFF_CENTER"
    case medicalDropoff   = "MEDICAL_DROPOFF"
    case hazardous        = "HAZARDOUS"
    case compost          = "COMPOST"
    case notRecyclable    = "NOT_RECYCLABLE"
    case reuse            = "REUSE"
}
```
