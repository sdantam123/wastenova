# Feature Specifications — Global Recycle

## F-01: Camera Object Identification

### Description
Users open the app and take a photo (or upload from gallery). The image is sent to an AI vision service that identifies all recyclable/non-recyclable objects in the frame.

### Acceptance Criteria
- [ ] Camera view launches within 1 second of opening
- [ ] Supports both photo capture and photo library selection
- [ ] AI identifies multiple objects in a single image
- [ ] Returns object name, confidence score, and recyclability assessment
- [ ] Processing completes within 5 seconds on LTE
- [ ] Graceful fallback if AI service is unavailable (offline mode with on-device ML)

### AI Classification Output
```json
{
  "objects": [
    {
      "name": "Plastic water bottle",
      "confidence": 0.97,
      "material": "PET Plastic (#1)",
      "recyclable": true,
      "category": "CURBSIDE",
      "notes": "Remove cap, rinse before recycling"
    },
    {
      "name": "Prescription medication bottle",
      "confidence": 0.94,
      "material": "HDPE Plastic (#2)",
      "recyclable": true,
      "category": "MEDICAL_DROPOFF",
      "notes": "Remove label with personal info. Medication inside requires drug take-back."
    }
  ]
}
```

### Recyclability Categories
| Category | Description |
|---|---|
| `CURBSIDE` | Accepted in standard home pickup |
| `DROPOFF_CENTER` | Must be taken to a local recycling center |
| `MEDICAL_DROPOFF` | Medications, sharps — requires licensed drop-off |
| `HAZARDOUS` | Batteries, electronics, paint — special hazmat disposal |
| `COMPOST` | Organic material for composting programs |
| `NOT_RECYCLABLE` | Goes in general waste |
| `REUSE` | Donation / repair recommended before disposal |

---

## F-02: Location Detection & Jurisdiction Identification

### Description
Using device GPS (with user permission), the app resolves the user's exact location to the most granular available government jurisdiction: Township → County → State/Province → Country. This hierarchy is used to look up the correct recycling rules.

### Acceptance Criteria
- [ ] Requests "When In Use" location permission on first use
- [ ] Resolves GPS coordinates to township/municipality name
- [ ] Falls back gracefully: Township → County → State → Country if lower level has no data
- [ ] Manual location input (zip code / postal code) as alternative
- [ ] Detected location displayed to user with ability to correct
- [ ] International coverage: US, Canada, UK, Australia, EU countries (Phase 1)

### Location Hierarchy Example
```
GPS: 40.7128° N, 74.0060° W
  → Country:   United States
  → State:     New Jersey
  → County:    Hudson County
  → Township:  Jersey City
  → Program:   Jersey City Curbside Recycling + Hudson County Drop-off
```

---

## F-03: Recycling Rules Engine

### Description
Once the jurisdiction and material type are known, the rules engine determines the correct recycling method and presentation.

### Decision Logic
```
Item Identified
      ↓
  Is item recyclable?
  ├── No → Show disposal instructions
  └── Yes → Determine category
              ├── CURBSIDE   → F-04: Pickup Calendar
              ├── DROPOFF    → F-05: Drop-off Centers
              ├── MEDICAL    → F-06: Medical Recycling
              └── HAZARDOUS  → F-06: Hazardous Drop-off
```

### Rules Data Points Per Jurisdiction
- Accepted materials list (by material code)
- Preparation instructions (rinse, flatten, remove caps, etc.)
- Materials explicitly NOT accepted
- Seasonal rule changes
- Special collection events

---

## F-04: Curbside Pickup Calendar

### Description
For items accepted in curbside recycling, the app displays the upcoming pickup schedule for the user's address.

### UI Elements
- Monthly calendar view with pickup days highlighted
- Material type shown per pickup (e.g., recycling Mondays, yard waste Fridays)
- Next 3 upcoming pickup dates shown prominently
- "Add to Calendar" button (exports to Apple Calendar)
- Push notification opt-in for pickup reminders (e.g., night before)
- Holiday delay notices

### Acceptance Criteria
- [ ] Calendar accurate to street-level address
- [ ] Displays at least 3 months forward
- [ ] Handles bi-weekly, weekly, and monthly schedules
- [ ] Correctly shows holiday-related schedule shifts
- [ ] Reminder notifications sent at user-configured time (default: 8 PM night before)

---

## F-05: Drop-off Center Locator

### Description
For items that must be dropped off, shows a map and list of nearby recycling centers with filtering by accepted material.

### UI Elements
- Map view (MapKit) with center pins
- List view with distance, address, hours, accepted materials
- Filter chips: Glass | Electronics | Textiles | Yard Waste | Curbside Overflow
- Tap a center → detail sheet (full address, phone, website, hours, materials list)
- "Get Directions" → opens Apple Maps
- "Call" button

### Acceptance Criteria
- [ ] Shows centers within 25-mile radius by default (configurable)
- [ ] Filter by material type pre-applied from the identified object
- [ ] Operating hours shown with "Open Now" / "Closed" status
- [ ] Handles seasonal/temporary closures
- [ ] Works internationally (adapts center data source per country)

---

## F-06: Medical & Hazardous Recycling

### Description
Special handling for regulated materials: prescription medications, OTC drugs, sharps/needles, and hazardous household waste (batteries, paint, motor oil, etc.).

### Sub-categories
| Sub-category | Examples | Program Type |
|---|---|---|
| Rx Medications | Prescription pills, liquids | DEA Drug Take-Back / Pharmacy drop-box |
| OTC Medications | Vitamins, OTC drugs | Pharmacy drop-box or mail-back |
| Sharps / Needles | Insulin needles, EpiPens | Sharps disposal container + drop-off |
| Batteries | AA, lithium, car batteries | Retail drop-off (Best Buy, Home Depot) |
| Electronics | Phones, laptops, TVs | E-waste events / retail take-back |
| Paint | Latex, oil-based | PaintCare drop-off sites |
| Motor oil | Used oil, filters | Auto parts stores |
| Propane tanks | Small cylinders | Hardware stores |

### UI Elements
- Drop-off location map filtered for the specific material/program
- Location details: name, address, hours, accepted items
- Instructions: how to prepare the item before drop-off
- Links to mail-back programs where available
- DEA National Take-Back Day schedule (twice yearly, US)

---

## F-07: Scan History & Impact Tracker

### Description
Users can review past scans and see a cumulative environmental impact summary.

### Metrics Tracked
- Items scanned and correctly recycled
- Estimated CO₂ saved (kg)
- Estimated landfill weight diverted (kg)
- Streak: consecutive weeks with recycling activity
- Badges (gamification): "Glass Guru", "Plastic Buster", etc.

---

## F-08: Global Localization

### Description
The app adapts language, recycling terminology, and regulations for each country.

### Phase 1 Countries
United States, Canada, United Kingdom, Australia, Germany, France, Japan

### Localization Requirements
- UI in local language (SwiftUI Localizable.strings)
- Recycling symbol standards vary by country — app uses local symbols
- Terminology: "Recycling Bin" (US/UK) vs "Yellow Bin" (Germany) vs "資源ごみ" (Japan)
- Date/time formats per locale
- Distance in miles (US) or km (international)
