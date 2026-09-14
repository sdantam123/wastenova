# Feature Specifications — Recycle Compass Web UI

## Feature Index

| ID | Feature | Audience | Priority |
|---|---|---|---|
| WF-01 | Item Lookup | Public | P0 |
| WF-02 | Pickup Calendar | Public | P0 |
| WF-03 | Drop-off Center Finder | Public | P0 |
| WF-04 | Medical & Hazardous Locator | Public | P1 |
| WF-05 | Location Detection & Override | Public | P0 |
| WF-06 | Impact Dashboard (Public) | Public | P1 |
| WF-07 | Admin — Rules Manager | Admin | P0 |
| WF-08 | Admin — Schedule Manager | Admin | P0 |
| WF-09 | Admin — Drop-off Centers Manager | Admin | P0 |
| WF-10 | Admin — Analytics Dashboard | Admin | P1 |
| WF-11 | User Authentication | Both | P0 |
| WF-12 | Jurisdiction Search & Filter | Both | P0 |

---

## WF-01: Item Lookup

### Description
Residents type an item name, scan a QR code, or paste a material type to look up recycling instructions specific to their detected jurisdiction.

### Acceptance Criteria
- [ ] Autocomplete suggestions appear after 2+ characters
- [ ] Results include: item name, recyclability status, category badge, preparation instructions
- [ ] Results are jurisdiction-specific (changes if user changes location)
- [ ] "Not sure?" link opens material type browsing grid
- [ ] Shareable URL: `/lookup?item=battery&zip=07302`

### Result Card Fields
| Field | Description |
|---|---|
| Item name | Identified object name |
| Recyclability | Curbside ✅ / Drop-off ⚠️ / Not Recyclable ❌ |
| Category badge | Color-coded MUI Chip (green / amber / red) |
| Preparation | Rinse, flatten, remove cap, etc. |
| Next action | "Find Drop-off" / "View Calendar" / "Find Medical Drop-off" |

---

## WF-02: Pickup Calendar

### Description
Residents enter their address and view a monthly calendar with all upcoming curbside pickup dates (recycling, yard waste, bulky item, etc.).

### Acceptance Criteria
- [ ] MUI DateCalendar with pickup days highlighted per category
- [ ] Next 3 pickup dates shown in a summary list above the calendar
- [ ] Legend explains color coding: ♻️ Mixed Recycling | 🌿 Yard Waste | 📦 Cardboard
- [ ] Holiday delay notices shown as banners (e.g., "Delay due to July 4th")
- [ ] "Add to Google Calendar" button exports `.ics` file
- [ ] Printable view available (CSS print styles)
- [ ] Supports weekly, bi-weekly, and monthly schedules

### AG Grid Usage
The admin side uses AG Grid to manage schedule data. The public calendar view uses MUI DateCalendar.

---

## WF-03: Drop-off Center Finder

### Description
Residents locate nearby recycling drop-off centers filtered by the material they need to dispose of.

### Acceptance Criteria
- [ ] Google Map with clustered pins for nearby centers
- [ ] List view (AG Grid) alongside map — rows sync with visible map area
- [ ] Filter bar: Material type chips (Glass | Electronics | Textiles | Paint | Batteries)
- [ ] Distance filter: 5 mi / 10 mi / 25 mi radius selector
- [ ] "Open Now" toggle to filter by current hours
- [ ] Click a row or pin → opens detail drawer (MUI Drawer)
- [ ] Center detail includes: name, address, phone, hours, accepted materials list
- [ ] "Get Directions" → opens Google Maps in new tab
- [ ] Handles no-results state gracefully with fallback message

### AG Grid Column Definitions
```
Name | Distance | Status (Open/Closed) | Accepted Materials | Hours | Actions
```

---

## WF-04: Medical & Hazardous Drop-off Locator

### Description
Specialized locator for regulated materials: prescription medications, sharps, batteries, electronics, paint, and motor oil.

### Sub-categories
| Material | Drop-off Program |
|---|---|
| Rx / OTC Medications | DEA Take-Back, pharmacy drop boxes |
| Sharps / Needles | Hospital sharps programs |
| Batteries (household) | Retail stores (Best Buy, Home Depot) |
| Electronics (e-waste) | E-waste events, retail take-back |
| Paint | PaintCare drop-off sites |
| Motor Oil | Auto parts store programs |

### Acceptance Criteria
- [ ] Material pre-selected based on lookup result (deep-link support)
- [ ] Warning banner: "Do NOT dispose in regular recycling or trash"
- [ ] Map + AG Grid list view identical to WF-03
- [ ] DEA National Take-Back Day event shown prominently (twice yearly)
- [ ] Mail-back program links shown where in-person drop-off is unavailable

---

## WF-05: Location Detection & Override

### Description
The app auto-detects the user's location via browser geolocation and resolves it to the nearest recycling jurisdiction.

### Acceptance Criteria
- [ ] Prompt browser geolocation permission on first visit
- [ ] Resolved location shown in TopBar: "📍 Jersey City, NJ" with edit icon
- [ ] Manual override: zip/postal code or city/state text input
- [ ] Location saved in localStorage for returning visitors
- [ ] Graceful fallback to state-level rules if township data unavailable
- [ ] International address support (US, Canada, UK, Australia — Phase 1)

---

## WF-06: Impact Dashboard (Public)

### Description
Residents view their personal recycling impact summary based on items looked up or household estimates.

### Metrics Displayed
| Metric | Visualization |
|---|---|
| Items looked up this month | MUI Stat card |
| Estimated CO₂ saved (kg) | Recharts bar chart (monthly) |
| Landfill weight diverted (kg) | Recharts area chart |
| Most recycled material | Donut chart |
| Streak (weeks active) | Progress ring |

---

## WF-07: Admin — Rules Manager

### Description
Municipal admins create, edit, and publish recycling rules per jurisdiction with AG Grid inline editing and bulk operations.

### AG Grid Features Used
- **ServerSideRowModel**: Loads paginated rules from `/admin/rules`
- **Inline cell editing**: Double-click to edit accepted materials, instructions
- **Master-Detail rows**: Expand to see per-material detail for a jurisdiction
- **Row grouping**: Group by State → County → Township
- **Excel export**: Download full ruleset as `.xlsx`
- **Filters Tool Panel**: Save filter presets by region or material type

### Columns
```
Jurisdiction | State | County | Township | Material | Category | Instructions | Last Updated | Status | Actions
```

### Acceptance Criteria
- [ ] Changes saved on blur (auto-save) with undo support (Ctrl+Z)
- [ ] Bulk edit: select multiple rows → "Set Category" dropdown applies to all
- [ ] Import rules from CSV or Excel template
- [ ] Publish / Draft toggle — unpublished rules not visible to public
- [ ] Change history audit log per rule

---

## WF-08: Admin — Schedule Manager

### Description
Municipal admins upload and manage pickup schedules for each address range or zip code.

### Acceptance Criteria
- [ ] Drag-and-drop CSV/Excel upload for bulk schedule import
- [ ] AG Grid preview of parsed schedule before confirmation
- [ ] Validation errors highlighted inline (red cell background)
- [ ] Edit individual pickup dates in AG Grid
- [ ] Holiday delay configuration: select date → all affected schedules shift
- [ ] Published schedules automatically served to resident calendar views

### CSV Template Columns
```
zip_code | street_prefix | collection_type | frequency | start_date | day_of_week | holiday_offset_days
```

---

## WF-09: Admin — Drop-off Centers Manager

### Description
Admins maintain the registry of drop-off center locations, hours, and accepted materials.

### Acceptance Criteria
- [ ] AG Grid with inline editing for center name, address, hours, materials
- [ ] "Add Center" form (React Hook Form + Zod) with geocoding address lookup
- [ ] Mark center as "Temporarily Closed" with reopen date
- [ ] Bulk import via CSV
- [ ] Map preview updates live as addresses are edited
- [ ] Accepted materials configured as multi-select MUI Autocomplete

---

## WF-10: Admin — Analytics Dashboard

### Description
Aggregate analytics for municipality program managers to track web portal usage and recycling engagement.

### Metrics
| Metric | Chart Type |
|---|---|
| Total item lookups per month | Recharts BarChart |
| Top searched items | AG Grid ranked list |
| Lookups by material category | Recharts PieChart |
| Geographic heatmap of user activity | Google Maps heatmap layer |
| Schedule page views by zip code | AG Grid with sparklines |

---

## WF-11: User Authentication

### Description
Optional login for residents (to save location and history); required for admin portal.

### Auth Methods
| Method | Audience |
|---|---|
| Google OAuth (Firebase Auth) | Residents + Admins |
| Email / Password | Admins only |
| SSO / SAML (Phase 2) | Enterprise municipality admins |

### Roles
| Role | Access |
|---|---|
| `PUBLIC` | Unauthenticated — public lookup, calendar, map |
| `RESIDENT` | Saved location, impact history |
| `MUNICIPALITY_MANAGER` | Admin portal for their jurisdiction only |
| `ADMIN` | Full access to all jurisdictions |

---

## WF-12: Jurisdiction Search & Filter

### Description
Both public and admin users can switch the active jurisdiction context to look up rules for any location.

### Acceptance Criteria
- [ ] Searchable dropdown: "Search by city, county, or zip code"
- [ ] Recent jurisdictions shown in dropdown history
- [ ] Admin filter panel: multi-select State + County chips to filter grid data
- [ ] URL reflects selected jurisdiction for shareability
