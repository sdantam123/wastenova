# UI/UX Flows — Global Recycle

## Design Principles
- **Clarity first**: Recycling instructions must be unambiguous in 1–2 seconds
- **One-action flow**: Minimum taps from camera to actionable result
- **Accessible**: WCAG 2.1 AA; VoiceOver compatible; Dynamic Type support
- **Green design**: Earthy palette reflecting environmental values

---

## Color Palette

| Token | Usage | Hex |
|---|---|---|
| `green-primary` | CTA buttons, curbside items | `#2E7D32` |
| `green-light` | Backgrounds, accepted badges | `#C8E6C9` |
| `amber-warning` | Drop-off required | `#F57F17` |
| `red-hazard` | Hazardous / medical items | `#C62828` |
| `blue-info` | Calendar, information | `#1565C0` |
| `gray-surface` | Card backgrounds | `#F5F5F5` |
| `gray-text` | Secondary text | `#616161` |

---

## Screen Inventory

| Screen ID | Screen Name |
|---|---|
| S-01 | Splash / Onboarding |
| S-02 | Permissions Gate (Camera + Location) |
| S-03 | Home / Dashboard |
| S-04 | Camera Viewfinder |
| S-05 | Analysis Loading |
| S-06 | Scan Results |
| S-07 | Item Detail |
| S-08 | Curbside Pickup Calendar |
| S-09 | Drop-off Center Map |
| S-10 | Drop-off Center Detail |
| S-11 | Medical Drop-off Map |
| S-12 | Medical Location Detail |
| S-13 | Scan History |
| S-14 | Impact Dashboard |
| S-15 | Settings |
| S-16 | Location Override |

---

## Primary User Flow

```
S-01 Onboarding (first launch only)
  ↓
S-02 Permissions Gate
  └─ Grant Camera + Location → S-03 Home

S-03 Home Dashboard
  ├─ Tap "Scan" → S-04 Camera Viewfinder
  ├─ Tap "History" → S-13 Scan History
  └─ Tap "Impact" → S-14 Impact Dashboard

S-04 Camera Viewfinder
  ├─ Capture photo → S-05 Analysis Loading
  └─ Pick from library → S-05 Analysis Loading

S-05 Analysis Loading (2–5 seconds)
  └─ AI result ready → S-06 Scan Results

S-06 Scan Results (list of identified objects)
  Each object card shows:
    • Object name + icon
    • Recyclable: ✅ / ❌
    • Category badge (color-coded)
    • Quick instruction (1 line)
    • "See Details" →

  └─ Tap object → S-07 Item Detail

S-07 Item Detail
  Shows full preparation instructions
  Based on category:
    ├─ CURBSIDE    → "View Pickup Calendar" → S-08
    ├─ DROPOFF     → "Find Drop-off Centers" → S-09
    ├─ MEDICAL     → "Find Medical Drop-off" → S-11
    └─ HAZARDOUS   → "Find Hazmat Drop-off" → S-09 (filtered)
```

---

## Screen Wireframes (Text Description)

### S-03: Home Dashboard
```
┌──────────────────────────────────┐
│  ☀️  Good morning, Jane           │
│  📍 Jersey City, NJ              │
│                                  │
│  ┌──────────────────────────┐    │
│  │   📷  SCAN AN ITEM        │    │
│  │   Tap to identify what   │    │
│  │   to do with your waste  │    │
│  └──────────────────────────┘    │
│                                  │
│  NEXT PICKUP                     │
│  ♻️  Recycling — Tomorrow (Tue)  │
│  🌿  Yard Waste — June 7         │
│                                  │
│  YOUR IMPACT                     │
│  128 items recycled  47 kg CO₂   │
│                                  │
│  [📷 Scan] [🗂 History] [📊 Impact]│
└──────────────────────────────────┘
```

### S-04: Camera Viewfinder
```
┌──────────────────────────────────┐
│   ✕                    📷 Lib   │
│                                  │
│  ┌────────────────────────────┐  │
│  │                            │  │
│  │    [LIVE CAMERA FEED]      │  │
│  │                            │  │
│  │  ┌──────────────────┐      │  │
│  │  │  Point at item   │      │  │
│  │  └──────────────────┘      │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
│           ⬤  CAPTURE             │
│                                  │
└──────────────────────────────────┘
```

### S-06: Scan Results
```
┌──────────────────────────────────┐
│  ← Back           📍 Jersey City │
│  Found 3 items                   │
│                                  │
│  ┌──────────────────────────┐    │
│  │ 🍶 Plastic Water Bottle  │    │
│  │ ✅ CURBSIDE RECYCLING    │    │
│  │ Rinse · Remove cap       │    │
│  │                [Details →]│    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │ 🔋 AA Battery            │    │
│  │ ⚠️  HAZARDOUS DROP-OFF   │    │
│  │ Tape terminals first     │    │
│  │                [Details →]│    │
│  └──────────────────────────┘    │
│                                  │
│  ┌──────────────────────────┐    │
│  │ 💊 Prescription Bottle   │    │
│  │ 🏥 MEDICAL DROP-OFF      │    │
│  │ Remove personal label    │    │
│  │                [Details →]│    │
│  └──────────────────────────┘    │
└──────────────────────────────────┘
```

### S-08: Curbside Pickup Calendar
```
┌──────────────────────────────────┐
│  ← Plastic Bottle               │
│  ♻️  Pickup Calendar             │
│  123 Main St, Jersey City        │
│                                  │
│  NEXT COLLECTION                 │
│  ┌──────────────────────────┐    │
│  │ 📅 Tomorrow — May 27     │    │
│  │ Mixed Recycling          │    │
│  │ [🔔 Remind Me] [+ iCal]  │    │
│  └──────────────────────────┘    │
│                                  │
│     MAY 2026                     │
│  Mo Tu We Th Fr Sa Su           │
│         1  2  3                 │
│   4  5  6  7  8  9  10          │
│  11 12 13 14 15 16 17           │
│  18 19 20 21 22 23 24           │
│  25 26 [27]28 29 30 31          │  ← highlighted
│                                  │
│  ♻️ = Recycling  🌿 = Yard Waste │
└──────────────────────────────────┘
```

### S-09: Drop-off Center Map
```
┌──────────────────────────────────┐
│  ← Back     🔋 Battery Drop-off │
│                                  │
│  ┌────────────────────────────┐  │
│  │   [MAP VIEW — MapKit]      │  │
│  │   📍 You                   │  │
│  │    🟢 CVS (0.3 mi)         │  │
│  │    🟢 Home Depot (1.2 mi)  │  │
│  │    🟡 Best Buy (3.4 mi)    │  │
│  └────────────────────────────┘  │
│                                  │
│  List ────────────────────────   │
│  🟢 CVS — 0.3 mi · Open 24/7    │
│     501 Washington Blvd          │
│                        [→ Go]    │
│  🟢 Home Depot — 1.2 mi · Open  │
│     125 NJ-440 Jersey City       │
│                        [→ Go]    │
└──────────────────────────────────┘
```

### S-11: Medical Drop-off Map
```
┌──────────────────────────────────┐
│  ← Back     💊 Medication        │
│             Drop-off             │
│                                  │
│  Your medication:                │
│  Prescription Pills              │
│  ⚠️  Do NOT flush medications    │
│                                  │
│  [MAP VIEW — nearby locations]   │
│                                  │
│  🏥 CVS Take-Back Drop Box       │
│     0.3 mi · 24/7 access         │
│     Accepts: Rx pills, OTC       │
│     ✗ No liquids, no needles     │
│                        [→ Go]    │
│                                  │
│  📅 DEA Take-Back Day            │
│     Oct 24, 2026                 │
│     Jersey City Police HQ        │
└──────────────────────────────────┘
```

---

## Navigation Structure

```
Tab Bar
├── 📷  Scan (default tab)
├── 🗂   History
├── 📊  Impact
└── ⚙️  Settings
```

## Accessibility Notes
- All color-coded badges include text label (never color alone)
- Map pins include accessible labels
- Camera shutter button: minimum 44×44 pt touch target
- VoiceOver reads scan results in priority order (most actionable first)
- Haptic feedback on successful photo capture and result load
