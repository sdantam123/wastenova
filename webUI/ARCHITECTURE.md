# Architecture — Recycle Compass Web UI

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                   Browser (React SPA)                    │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  Public App  │  │  Admin Portal│  │ Auth / Session │  │
│  │  (Residents) │  │ (Admins)     │  │  (Firebase)    │  │
│  └──────┬───────┘  └──────┬───────┘  └───────┬────────┘  │
│         │                 │                  │            │
│         └─────────────────┴──────────────────┘            │
│                    React Router v6                        │
│                    (Nested Routes)                        │
│                           │                              │
│         ┌─────────────────┼─────────────────┐            │
│         │                 │                 │            │
│   RTK Query         Redux Toolkit        Zustand         │
│   (server cache)    (global state)   (local UI state)    │
│         │                                               │
│  ┌──────▼──────────────────────────────────────────┐    │
│  │              Component Layer                    │    │
│  │  MUI Components  +  AG Grid  +  Google Maps     │    │
│  └──────────────────────────────────────────────────┘    │
└────────────────────────────┬─────────────────────────────┘
                             │ HTTPS / REST
                             ▼
              ┌──────────────────────────────┐
              │  Core Backend (NestJS / AWS)  │
              └──────────────────────────────┘
```

---

## Application Zones

### 1. Public Zone (`/`)
Available without authentication. Residents can:
- Search recycling rules by item name or material
- View their pickup calendar by address
- Find drop-off centers on a map
- Browse accepted materials for their jurisdiction

### 2. Admin Portal (`/admin`)
Requires authentication (`ADMIN` or `MUNICIPALITY_MANAGER` role). Admins can:
- Manage recycling programs and rules per jurisdiction
- Upload and update pickup schedules
- Manage drop-off center records
- View adoption and impact analytics with AG Grid dashboards

---

## Folder Architecture

```
src/
├── api/
│   ├── baseQuery.ts          # Axios base query for RTK Query
│   ├── recycleApi.ts         # RTK Query API slice (all endpoints)
│   └── types.ts              # API request/response types
│
├── components/
│   ├── common/
│   │   ├── CategoryBadge.tsx        # Color-coded recycling category chip
│   │   ├── MaterialIcon.tsx         # Recycling category icon resolver
│   │   ├── RecyclabilityIndicator.tsx
│   │   └── SearchBar.tsx            # Global item search
│   ├── layout/
│   │   ├── AppShell.tsx             # Root layout with sidebar + topbar
│   │   ├── TopBar.tsx               # App header with location + user menu
│   │   ├── Sidebar.tsx              # Admin navigation sidebar
│   │   └── Footer.tsx
│   ├── maps/
│   │   ├── DropoffMap.tsx           # Google Map with center pins
│   │   └── LocationPicker.tsx       # Address geocoding + pin input
│   └── grids/
│       ├── RulesGrid.tsx            # AG Grid for recycling rules
│       ├── SchedulesGrid.tsx        # AG Grid for pickup schedules
│       └── CentersGrid.tsx          # AG Grid for drop-off centers
│
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── authSlice.ts
│   │   └── useAuth.ts
│   ├── lookup/
│   │   ├── ItemLookupPage.tsx       # Search by item name or scan result
│   │   ├── ResultCard.tsx
│   │   └── lookupSlice.ts
│   ├── calendar/
│   │   ├── CalendarPage.tsx
│   │   ├── PickupCalendar.tsx       # MUI DateCalendar with pickup highlights
│   │   └── NextPickupBanner.tsx
│   ├── dropoff/
│   │   ├── DropoffFinderPage.tsx
│   │   ├── CenterList.tsx           # AG Grid list view
│   │   └── CenterDetailDrawer.tsx
│   ├── admin/
│   │   ├── RulesManagerPage.tsx     # AG Grid rules CRUD
│   │   ├── ScheduleUploaderPage.tsx
│   │   ├── CentersManagerPage.tsx
│   │   └── AdminDashboardPage.tsx
│   └── dashboard/
│       ├── ImpactDashboardPage.tsx
│       └── ImpactCharts.tsx         # Recharts CO₂ / items recycled
│
├── hooks/
│   ├── useLocation.ts               # Browser geolocation + reverse geocode
│   ├── useJurisdiction.ts           # Resolves township/county from coords
│   └── usePickupDates.ts            # Computes highlighted calendar dates
│
├── store/
│   ├── store.ts                     # Redux store setup
│   └── locationSlice.ts             # User's detected/overridden location
│
├── theme/
│   ├── theme.ts                     # MUI createTheme with brand tokens
│   └── tokens.ts                    # Raw design token values
│
├── types/
│   ├── recycling.ts                 # RecyclingRule, DropoffCenter, Schedule
│   ├── jurisdiction.ts              # Country, State, County, Township
│   └── user.ts                      # User, Role, Session
│
└── utils/
    ├── formatters.ts                # Date, distance, weight formatters
    ├── categoryColors.ts            # Map RecyclingCategory → MUI color
    └── validators.ts                # Zod schemas (shared with backend)
```

---

## Data Flow

### Resident Lookup Flow
```
User types item name in SearchBar
        ↓
RTK Query → GET /lookup?item=battery&lat=40.7&lng=-74.0
        ↓
RecyclingResult[] returned
        ↓
ResultCard list renders (MUI Cards + CategoryBadge)
        ↓
User clicks "Find Drop-off" → DropoffFinderPage
        ↓
RTK Query → GET /centers?material=HAZARDOUS&lat=40.7&lng=-74.0
        ↓
AG Grid (CentersGrid) + Google Map render simultaneously
```

### Admin Rules Management Flow
```
Admin navigates to /admin/rules
        ↓
AG Grid fetches paginated rows via ServerSideRowModel
  → GET /admin/rules?jurisdiction=hudson-county-nj&page=0&size=100
        ↓
Admin edits a cell (inline editing enabled in AG Grid)
        ↓
onCellValueChanged → dispatches RTK mutation
  → PUT /admin/rules/:id { field, value }
        ↓
RTK Query invalidates [Rules] cache tag
        ↓
AG Grid refreshes affected rows
```

---

## Component Patterns

### Feature Module Pattern
Each feature in `src/features/` follows this structure:
```
features/lookup/
  ├── ItemLookupPage.tsx    ← route-level page component
  ├── ResultCard.tsx        ← presentation component
  ├── lookupSlice.ts        ← RTK slice (or Zustand store)
  └── index.ts              ← public exports
```

### AG Grid Configuration Pattern
All AG Grid instances use a shared base config extended per use case:

```ts
const baseGridOptions: GridOptions = {
  animateRows: true,
  rowSelection: 'multiple',
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
    minWidth: 100,
  },
  theme: 'ag-theme-material',   // matches MUI look
};
```

---

## Performance Strategies

| Strategy | Implementation |
|---|---|
| Code splitting | `React.lazy()` + `Suspense` on every route |
| Server-side pagination | AG Grid `ServerSideRowModelModule` for large datasets |
| API response caching | RTK Query with `keepUnusedDataFor: 300` (5 min) |
| Memoization | `React.memo`, `useMemo`, `useCallback` on grid cell renderers |
| Virtual scrolling | AG Grid built-in row virtualization |
| Image optimization | WebP format, lazy `<img loading="lazy">` |
| Bundle optimization | Vite tree-shaking, dynamic imports for AG Grid Enterprise modules |

---

## Security

| Concern | Approach |
|---|---|
| Authentication | Firebase Auth ID tokens validated on every API call |
| Route protection | `<RequireAuth>` wrapper component on all `/admin/*` routes |
| CSRF | SameSite cookies + CORS policy enforced at API Gateway |
| Input sanitization | Zod validation on all form inputs before API submission |
| XSS | React's default JSX escaping; no `dangerouslySetInnerHTML` |
| Sensitive env vars | All secrets in `.env` files excluded from source control |
