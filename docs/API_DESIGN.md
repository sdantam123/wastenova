# API Design — Global Recycle

## Base URL
```
Production:  https://api.globalrecycle.app/v1
Staging:     https://api-staging.globalrecycle.app/v1
Local:       http://localhost:3000/v1
```

## Authentication
All endpoints (except `/auth/*`) require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### Auth

#### `POST /auth/apple`
Sign in with Apple.
```json
// Request
{ "identityToken": "eyJ..." }

// Response 200
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "user": { "id": "u_123", "name": "Jane", "email": "jane@example.com" }
}
```

#### `POST /auth/google`
Sign in with Google OAuth2.

#### `POST /auth/refresh`
Rotate JWT access token using refresh token.

---

### Vision / AI Analysis

#### `POST /vision/analyze`
Analyze an image and return identified objects with recycling classifications.

```json
// Request (multipart/form-data)
{
  "image": <binary>,
  "latitude": 40.7128,
  "longitude": -74.0060
}

// Response 200
{
  "analysisId": "a_abc123",
  "jurisdiction": {
    "country": "United States",
    "state": "New Jersey",
    "county": "Hudson County",
    "township": "Jersey City"
  },
  "objects": [
    {
      "id": "obj_1",
      "name": "Plastic water bottle",
      "material": "PET Plastic",
      "materialCode": "1",
      "recyclable": true,
      "category": "CURBSIDE",
      "preparationInstructions": ["Remove cap", "Rinse clean", "Flatten if possible"],
      "confidence": 0.97
    },
    {
      "id": "obj_2",
      "name": "AA Battery",
      "material": "Alkaline Battery",
      "recyclable": true,
      "category": "HAZARDOUS",
      "preparationInstructions": ["Tape terminals before disposal"],
      "confidence": 0.95
    }
  ]
}
```

**Status Codes**: `200 OK`, `400 Bad Request` (no image), `422 Unprocessable` (image unclear), `503 Service Unavailable` (LLM down)

---

### Location

#### `GET /location/resolve`
Convert GPS coordinates to jurisdiction hierarchy.

```
Query params:
  lat=40.7128
  lng=-74.0060

// Response 200
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "country": "United States",
  "countryCode": "US",
  "state": "New Jersey",
  "stateCode": "NJ",
  "county": "Hudson County",
  "township": "Jersey City",
  "postalCode": "07302",
  "jurisdictionId": "jur_us_nj_hudson_jerseycity"
}
```

#### `GET /location/resolve-by-postal`
```
Query params:
  postalCode=07302
  countryCode=US
```

---

### Recycling Rules

#### `GET /rules/{jurisdictionId}`
Get recycling rules for a specific jurisdiction.

```json
// Response 200
{
  "jurisdictionId": "jur_us_nj_hudson_jerseycity",
  "jurisdictionName": "Jersey City, NJ",
  "lastUpdated": "2026-04-15T00:00:00Z",
  "curbsideAccepted": [
    { "materialCode": "1", "name": "PET Plastic", "notes": "Bottles and jugs only" },
    { "materialCode": "2", "name": "HDPE Plastic", "notes": "Bottles and jugs only" },
    { "name": "Aluminum cans" },
    { "name": "Glass bottles and jars" },
    { "name": "Cardboard", "notes": "Break down boxes flat" },
    { "name": "Paper" }
  ],
  "curbsideNotAccepted": [
    { "name": "Plastic bags", "reason": "Clogs sorting machinery" },
    { "name": "Styrofoam" }
  ],
  "specialPrograms": ["MEDICAL_DROPOFF", "ELECTRONICS_EWASTE", "YARD_WASTE"]
}
```

#### `GET /rules/{jurisdictionId}/material/{materialCode}`
Get rules for a specific material in a jurisdiction.

---

### Pickup Calendar

#### `GET /calendar/{jurisdictionId}`
Get pickup schedule for a jurisdiction.

```
Query params:
  address=123+Main+St (optional, for street-level accuracy)
  from=2026-05-01
  to=2026-07-31

// Response 200
{
  "jurisdictionId": "jur_us_nj_hudson_jerseycity",
  "schedule": [
    {
      "date": "2026-05-27",
      "type": "RECYCLING",
      "materials": ["Mixed Recyclables"],
      "notes": null
    },
    {
      "date": "2026-06-03",
      "type": "RECYCLING",
      "materials": ["Mixed Recyclables"],
      "notes": null
    },
    {
      "date": "2026-06-07",
      "type": "YARD_WASTE",
      "materials": ["Leaves", "Grass clippings"],
      "notes": "Bags only, no loose debris"
    }
  ],
  "holidayDelays": [
    {
      "holiday": "Independence Day",
      "date": "2026-07-04",
      "impact": "Collection delayed one day July 4–8"
    }
  ]
}
```

---

### Drop-off Centers

#### `GET /centers`
Get nearby recycling drop-off centers.

```
Query params:
  lat=40.7128
  lng=-74.0060
  radius=25               (miles, default 25)
  material=BATTERY        (optional filter)
  category=HAZARDOUS      (optional filter)
  openNow=true            (optional)
  limit=20

// Response 200
{
  "centers": [
    {
      "id": "ctr_456",
      "name": "Hudson County Recycling Center",
      "type": "COUNTY_CENTER",
      "address": "2 Hackensack Plz, Jersey City, NJ 07302",
      "latitude": 40.7178,
      "longitude": -74.0431,
      "distanceMiles": 0.8,
      "phone": "+12015551234",
      "website": "https://hudsoncountynj.gov/recycle",
      "hours": [
        { "day": "Monday", "open": "08:00", "close": "17:00" },
        { "day": "Saturday", "open": "09:00", "close": "15:00" },
        { "day": "Sunday", "open": "closed", "close": null }
      ],
      "isOpenNow": true,
      "acceptedMaterials": ["Electronics", "Batteries", "Textiles", "Metal"]
    }
  ],
  "total": 7
}
```

---

### Medical / Hazardous Drop-off

#### `GET /centers/medical`
Get medical/Rx/sharps drop-off locations.

```
Query params:
  lat=40.7128
  lng=-74.0060
  type=RX_MEDICATION | SHARPS | OTC_MEDICATION
  radius=10
  limit=10

// Response 200
{
  "locations": [
    {
      "id": "med_789",
      "name": "CVS Pharmacy — Drug Take-Back",
      "type": "PHARMACY_DROPBOX",
      "address": "501 Washington Blvd, Jersey City, NJ 07310",
      "distanceMiles": 0.3,
      "phone": "+12015559999",
      "hours": "24/7 (drop-box inside pharmacy)",
      "acceptedItems": ["Rx medications", "OTC medications"],
      "notAccepted": ["Needles", "Liquids", "Inhalers"],
      "isOpenNow": true,
      "programName": "DEA Drug Take-Back"
    }
  ],
  "upcomingEvents": [
    {
      "name": "DEA National Prescription Drug Take-Back Day",
      "date": "2026-10-24",
      "locations": ["Jersey City Police Dept HQ", "Hudson Mall Parking Lot A"]
    }
  ]
}
```

---

### User History

#### `GET /history`
Get user's scan history.

#### `POST /history`
Save a scan result to history.

#### `GET /history/impact`
Get aggregated environmental impact stats.

```json
// Response 200
{
  "userId": "u_123",
  "totalItemsScanned": 142,
  "itemsCorrectlyRecycled": 128,
  "estimatedCO2SavedKg": 47.3,
  "estimatedLandfillDivertedKg": 89.1,
  "currentStreakWeeks": 6,
  "badges": ["Glass Guru", "Plastic Buster", "Medical Pro"]
}
```

---

## Error Response Schema

```json
{
  "error": {
    "code": "JURISDICTION_NOT_FOUND",
    "message": "No recycling data available for this location.",
    "details": "Coverage coming soon for this region.",
    "statusCode": 404
  }
}
```

## Standard Error Codes
| Code | HTTP | Description |
|---|---|---|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `JURISDICTION_NOT_FOUND` | 404 | No rules data for location |
| `CENTER_NOT_FOUND` | 404 | No centers match criteria |
| `IMAGE_TOO_LARGE` | 400 | Image exceeds 10 MB |
| `IMAGE_UNCLEAR` | 422 | Cannot identify objects |
| `AI_SERVICE_UNAVAILABLE` | 503 | LLM service down, try offline fallback |
| `RATE_LIMITED` | 429 | Too many requests |
