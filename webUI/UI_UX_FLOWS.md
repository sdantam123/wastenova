# UI/UX Flows — Recycle Compass Web UI

## Design Principles

- **Instant clarity**: Recycling verdict visible within 2 seconds of search
- **Location-aware**: All results adapt to the user's detected or entered jurisdiction
- **Accessible**: WCAG 2.1 AA compliant — color alone never conveys meaning; all badges include text labels
- **Mobile-first responsive**: Fully functional on mobile browsers; no separate mobile build required
- **Progressive disclosure**: Summary first, detail on demand (drawer/modal pattern)

---

## Design Tokens

### Color Palette

| Token | Hex | MUI Mapping | Usage |
|---|---|---|---|
| `green-primary` | `#2E7D32` | `primary.main` | CTA buttons, curbside items, nav active |
| `green-light` | `#C8E6C9` | `primary.light` | Card backgrounds for accepted items |
| `amber-warning` | `#F57F17` | `warning.main` | Drop-off required badges |
| `amber-light` | `#FFF8E1` | `warning.light` | Drop-off card backgrounds |
| `red-hazard` | `#C62828` | `error.main` | Hazardous / medical badges |
| `red-light` | `#FFEBEE` | `error.light` | Hazardous card backgrounds |
| `blue-info` | `#1565C0` | `info.main` | Calendar highlights, informational |
| `gray-surface` | `#F5F5F5` | `grey.100` | Page backgrounds, card surfaces |
| `gray-text` | `#616161` | `text.secondary` | Secondary labels |

### Typography

| Scale | MUI Variant | Font | Usage |
|---|---|---|---|
| Page title | `h4` | Inter 600 | Page headers |
| Section title | `h6` | Inter 600 | Card titles, section labels |
| Body | `body1` | Inter 400 | Primary content |
| Caption | `caption` | Inter 400 | Metadata, hints |
| Button | `button` | Inter 600 | All button labels |

### Spacing Scale
MUI default: `theme.spacing(1) = 8px`. Common values: `1→8px, 2→16px, 3→24px, 4→32px`.

---

## Page Wireframes

### Home Page (`/`)

```
┌───────────────────────────────────────────────────────────────────┐
│ 🧭 Recycle Compass     Lookup  Calendar  Drop-off  Impact  [Login]│
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│          ♻️  What can you recycle today?                          │
│          📍 Jersey City, NJ   [Change]                            │
│                                                                   │
│     ┌──────────────────────────────────────────────┐             │
│     │  🔍  Search by item (e.g. "battery", "pizza box")  │             │
│     └──────────────────────────────────────────────┘             │
│                                                                   │
│     ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│     │ 📅 Pickup    │  │ 📍 Drop-off  │  │ 📊 My Impact │        │
│     │  Calendar    │  │   Finder     │  │  Dashboard   │        │
│     └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                   │
│  NEXT PICKUP — 📍 Jersey City                                     │
│  ┌──────────────────────────────────────────────┐                │
│  │ ♻️  Mixed Recycling — Tomorrow, June 14      │                │
│  │ 🌿 Yard Waste — June 21                      │                │
│  └──────────────────────────────────────────────┘                │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

---

### Item Lookup Page (`/lookup`)

```
┌───────────────────────────────────────────────────────────────────┐
│  ← Home    🔍 Search: "battery"              📍 Jersey City, NJ  │
├───────────────────────────────────────────────────────────────────┤
│  Found 2 results for "battery"                                    │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐      │
│  │ 🔋 AA / AAA Battery                                    │      │
│  │ ⚠️  [HAZARDOUS DROP-OFF]    Tape terminals before drop  │      │
│  │                                                        │      │
│  │ Preparation:                                           │      │
│  │  1. Place tape over both terminals                     │      │
│  │  2. Do not place in curbside recycling                 │      │
│  │  3. Take to a retail drop-off location                 │      │
│  │                                                        │      │
│  │               [Find Drop-off Locations →]              │      │
│  └────────────────────────────────────────────────────────┘      │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐      │
│  │ 🔌 Lithium Battery (laptop / phone)                    │      │
│  │ ⚠️  [HAZARDOUS DROP-OFF]    Do not puncture or crush   │      │
│  │               [Find E-Waste Locations →]               │      │
│  └────────────────────────────────────────────────────────┘      │
└───────────────────────────────────────────────────────────────────┘
```

---

### Pickup Calendar Page (`/calendar`)

```
┌───────────────────────────────────────────────────────────────────┐
│  📅 Pickup Calendar             📍 123 Main St, Jersey City, NJ  │
│                                  [Change Address]                 │
├───────────────────────────────────────────────────────────────────┤
│  ⚠️  Holiday Notice: July 4th delay — all pickups shift +1 day   │
├───────────────────────────────────────────────────────────────────┤
│  UPCOMING PICKUPS                                                 │
│  ┌─────────────────────────────────────────────────────┐         │
│  │ ♻️  Mixed Recycling — Tomorrow, Jun 14               │         │
│  │ 🌿 Yard Waste — Sat, Jun 21                          │         │
│  │ 📦 Cardboard — Mon, Jun 16                           │         │
│  │                    [+ Add to Google Calendar]        │         │
│  └─────────────────────────────────────────────────────┘         │
│                                                                   │
│       ◄  JUNE 2026  ►                                            │
│  Su  Mo  Tu  We  Th  Fr  Sa                                      │
│   1   2   3   4   5   6   7                                      │
│   8   9  10  11  12 [13] 14 ♻️                                   │
│  15  16📦 17  18  19  20  21🌿                                   │
│  22  23  24  25  26  27♻️ 28                                     │
│  29  30                                                          │
│                                                                   │
│  Legend:  ♻️ Mixed Recycling  📦 Cardboard  🌿 Yard Waste        │
└───────────────────────────────────────────────────────────────────┘
```

---

### Drop-off Finder Page (`/dropoff`)

```
┌───────────────────────────────────────────────────────────────────┐
│  📍 Drop-off Finder             [Material: Batteries ✕]          │
│  [Glass] [Electronics] [Batteries✓] [Paint] [Textiles]  5mi ▼   │
├─────────────────────────────┬─────────────────────────────────────┤
│                             │  Name         Dist  Status  Hours  │
│   [GOOGLE MAP VIEW]         │  ─────────────────────────────────  │
│                             │  CVS Pharmacy  0.3mi  🟢 Open  24/7│
│   📍 You                    │  Home Depot    1.2mi  🟢 Open  7-9 │
│   🟢 CVS (0.3mi)            │  Best Buy      3.4mi  🟡 Closes 8p │
│   🟢 Home Depot (1.2mi)     │  Target        4.1mi  🟢 Open  8-10│
│   🟡 Best Buy (3.4mi)       │                                    │
│                             │  [Load more results]               │
│                             │                                    │
└─────────────────────────────┴─────────────────────────────────────┘

  ← Detail Drawer (opens on row click) →
  ┌────────────────────────────────────────┐
  │  🟢 CVS Pharmacy                        │
  │  501 Washington Blvd, Jersey City, NJ   │
  │  📞 (201) 555-0123  ·  0.3 mi away     │
  │                                         │
  │  Hours: 24/7                            │
  │                                         │
  │  Accepted Materials:                    │
  │  ✅ Household Batteries                 │
  │  ✅ Prescription Medications            │
  │  ❌ Liquids  ❌ Sharps                  │
  │                                         │
  │  [Get Directions ↗]  [Call 📞]         │
  └────────────────────────────────────────┘
```

---

### Admin Rules Manager Page (`/admin/rules`)

```
┌───────────────────────────────────────────────────────────────────┐
│ Admin  >  Rules Manager                          [+ Add Rule]     │
│                                                  [⬇ Export Excel] │
├───┬─────────────────────────────────────────────────────────────┤
│   │ Columns  Filters                                            │
│   │                                                             │
│   │ Jurisdiction  ▼│State ▼│County ▼│Material ▼│Category │...  │
│   │─────────────────────────────────────────────────────────── │
│ ▶ │ Jersey City      NJ     Hudson   PET #1     CURBSIDE   ✅  │
│   │   └─ Preparation: Rinse • Remove cap • Flatten             │
│ ▶ │ Jersey City      NJ     Hudson   Glass      DROPOFF    ⚠️  │
│   │   └─ Preparation: Separate by color — Green/Brown/Clear    │
│ ▶ │ Jersey City      NJ     Hudson   Battery    HAZARDOUS  ⚠️  │
│   │   └─ Preparation: Tape terminals — take to retail drop-off │
│   │                                                             │
│   │ Rows 1-50 of 247                       [< 1 2 3 4 5 >]    │
└───┴─────────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

| Breakpoint | Width | Layout Adaptation |
|---|---|---|
| `xs` | < 600px | Single-column, map hidden (list only), condensed TopBar |
| `sm` | 600–900px | Single-column, map collapsible |
| `md` | 900–1200px | Two-column map+list, sidebar icon-only |
| `lg` | 1200–1536px | Full layout, expanded sidebar |
| `xl` | > 1536px | Max-width container centered |

---

## Interaction Patterns

| Pattern | Component | Behavior |
|---|---|---|
| Autocomplete search | `ItemSearchAutocomplete` | Debounce 300 ms, show spinner, keyboard nav |
| Inline cell editing | AG Grid rules/centers | Double-click to edit, Enter to save, Esc to cancel |
| Map ↔ Grid sync | `DropoffFinderPage` | Hover row highlights pin; click pin selects row and opens drawer |
| Pagination | Admin AG Grid | Server-side infinite scroll (load 50 rows, fetch more on scroll) |
| Toast notifications | MUI Snackbar | Auto-dismiss 4s for success; persistent for errors |
| Drawer | `CenterDetailDrawer` | Slides in from right on desktop; full-screen bottom sheet on mobile |

---

## Accessibility Requirements

- All interactive elements meet 4.5:1 contrast ratio minimum
- Focus ring visible on all focusable elements (MUI default + custom override)
- AG Grid keyboard navigation: Tab between cells, Arrow keys to move, F2 to edit
- All icons accompanied by `aria-label` or visible text label
- Color-coded category badges include text (e.g., "CURBSIDE" text, not just green color)
- Map markers include accessible description via `title` prop
- Forms include associated `<label>` for every input field
