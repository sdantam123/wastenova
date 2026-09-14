# Component Inventory — Recycle Compass Web UI

## Component Categories

- [Layout](#layout-components)
- [Common / Shared](#common--shared-components)
- [Recycling Domain](#recycling-domain-components)
- [Maps](#map-components)
- [AG Grid Wrappers](#ag-grid-wrappers)
- [Forms](#form-components)
- [Pages](#page-components)

---

## Layout Components

| Component | Path | Description |
|---|---|---|
| `AppShell` | `components/layout/AppShell.tsx` | Root layout: TopBar + optional Sidebar + `<Outlet>` |
| `TopBar` | `components/layout/TopBar.tsx` | App header with logo, location chip, user avatar menu |
| `Sidebar` | `components/layout/Sidebar.tsx` | Admin navigation drawer (MUI Drawer, collapsible) |
| `Footer` | `components/layout/Footer.tsx` | Links, copyright, accessibility statement |
| `PageContainer` | `components/layout/PageContainer.tsx` | Centered `<Container>` with consistent page padding |
| `SectionHeader` | `components/layout/SectionHeader.tsx` | Page title + breadcrumb + optional action button |

---

## Common / Shared Components

| Component | Path | Props Summary | Description |
|---|---|---|---|
| `CategoryBadge` | `components/common/CategoryBadge.tsx` | `category: RecyclingCategory` | Color-coded MUI Chip: green/amber/red/blue |
| `RecyclabilityIcon` | `components/common/RecyclabilityIcon.tsx` | `recyclable: boolean, category` | ✅ / ⚠️ / ❌ icon with tooltip |
| `MaterialAvatar` | `components/common/MaterialAvatar.tsx` | `material: string` | Small circular icon for material type (plastic, glass, etc.) |
| `StatusChip` | `components/common/StatusChip.tsx` | `status: 'open' \| 'closed' \| 'temp-closed'` | "Open Now" / "Closed" chip with dot indicator |
| `SearchBar` | `components/common/SearchBar.tsx` | `onSearch, placeholder, loading` | Autocomplete search with debounce (300 ms) |
| `EmptyState` | `components/common/EmptyState.tsx` | `icon, title, description, action?` | Centered empty state illustration + message |
| `ErrorBoundary` | `components/common/ErrorBoundary.tsx` | `fallback?` | React error boundary with fallback UI |
| `LoadingOverlay` | `components/common/LoadingOverlay.tsx` | `loading: boolean` | MUI CircularProgress centered overlay |
| `ConfirmDialog` | `components/common/ConfirmDialog.tsx` | `open, title, message, onConfirm, onCancel` | Generic confirmation dialog |
| `NotificationBanner` | `components/common/NotificationBanner.tsx` | `type, message, dismissible?` | MUI Alert banner (info/warning/error/success) |
| `ImpactStat` | `components/common/ImpactStat.tsx` | `label, value, unit, icon, trend?` | Single KPI card with optional trend arrow |

---

## Recycling Domain Components

| Component | Path | Description |
|---|---|---|
| `ResultCard` | `features/lookup/ResultCard.tsx` | MUI Card showing item, category, instructions, next-action button |
| `ItemSearchAutocomplete` | `features/lookup/ItemSearchAutocomplete.tsx` | MUI Autocomplete backed by `/lookup/suggestions` endpoint |
| `PreparationSteps` | `features/lookup/PreparationSteps.tsx` | Numbered list of preparation instructions per item |
| `NextPickupBanner` | `features/calendar/NextPickupBanner.tsx` | Prominent banner: "Next pickup: Tomorrow — Mixed Recycling" |
| `PickupCalendar` | `features/calendar/PickupCalendar.tsx` | MUI DateCalendar with custom day cell renderer for pickup highlights |
| `PickupLegend` | `features/calendar/PickupLegend.tsx` | Color legend for calendar pickup types |
| `HolidayDelayAlert` | `features/calendar/HolidayDelayAlert.tsx` | MUI Alert showing holiday-related schedule delays |
| `CenterDetailDrawer` | `features/dropoff/CenterDetailDrawer.tsx` | MUI Drawer with full center info: address, hours, materials, directions |
| `MaterialFilterBar` | `features/dropoff/MaterialFilterBar.tsx` | Row of MUI Chip toggles: Glass, Electronics, Batteries, etc. |
| `RadiusSelector` | `features/dropoff/RadiusSelector.tsx` | MUI ToggleButtonGroup: 5 mi / 10 mi / 25 mi |
| `MedicalWarningBanner` | `features/dropoff/MedicalWarningBanner.tsx` | ⚠️ "Do NOT flush medications" prominent banner |
| `ImpactCharts` | `features/dashboard/ImpactCharts.tsx` | Recharts composite: bar + area + donut for impact metrics |

---

## Map Components

| Component | Path | Description |
|---|---|---|
| `DropoffMap` | `components/maps/DropoffMap.tsx` | Google Map with `MarkerClusterer`, synced to AG Grid list |
| `CenterPin` | `components/maps/CenterPin.tsx` | Custom map pin with status color (open=green, closed=gray) |
| `LocationPicker` | `components/maps/LocationPicker.tsx` | Address autocomplete (Google Places) + draggable pin |
| `HeatmapLayer` | `components/maps/HeatmapLayer.tsx` | Google Maps heatmap overlay for admin analytics (WF-10) |
| `DirectionsButton` | `components/maps/DirectionsButton.tsx` | "Get Directions" button opening Google Maps deep link |

---

## AG Grid Wrappers

All AG Grid wrappers apply the shared `ag-theme-material` theme and the base `GridOptions` config.

| Component | Path | Row Model | Description |
|---|---|---|---|
| `CentersGrid` | `components/grids/CentersGrid.tsx` | Client-side | Drop-off center list — Name, Distance, Status, Materials |
| `RulesGrid` | `components/grids/RulesGrid.tsx` | Server-side | Admin rules manager with inline editing + master-detail |
| `SchedulesGrid` | `components/grids/SchedulesGrid.tsx` | Client-side | Upload preview and schedule review table |
| `AdminCentersGrid` | `components/grids/AdminCentersGrid.tsx` | Server-side | Admin centers CRUD with add/edit/delete row actions |
| `AnalyticsGrid` | `components/grids/AnalyticsGrid.tsx` | Client-side | Top searched items with AG Grid sparkline columns |
| `ImportPreviewGrid` | `components/grids/ImportPreviewGrid.tsx` | Client-side | CSV import preview with validation error highlights |

### Shared AG Grid Column Types

Registered in `gridColumnTypes.ts` and reused across grids:

```ts
columnTypes: {
  'categoryColumn': {
    cellRenderer: CategoryBadgeCellRenderer,
    width: 160,
    filter: 'agSetColumnFilter',
  },
  'statusColumn': {
    cellRenderer: StatusChipCellRenderer,
    width: 120,
  },
  'distanceColumn': {
    valueFormatter: ({ value }) => `${value.toFixed(1)} mi`,
    sort: 'asc',
    width: 110,
  },
  'actionsColumn': {
    cellRenderer: RowActionsCellRenderer,
    sortable: false,
    filter: false,
    pinned: 'right',
    width: 120,
  },
}
```

---

## Form Components

| Component | Path | Description |
|---|---|---|
| `AddCenterForm` | `features/admin/AddCenterForm.tsx` | React Hook Form + Zod — create/edit a drop-off center |
| `JurisdictionSelector` | `forms/JurisdictionSelector.tsx` | Cascading State → County → Township MUI Selects |
| `MaterialMultiSelect` | `forms/MaterialMultiSelect.tsx` | MUI Autocomplete multi-select for accepted material types |
| `ScheduleUploader` | `features/admin/ScheduleUploader.tsx` | Drag-and-drop file input + CSV parse + `ImportPreviewGrid` |
| `LocationOverrideForm` | `features/lookup/LocationOverrideForm.tsx` | Zip/postal code or city input to override detected location |
| `LoginForm` | `features/auth/LoginForm.tsx` | Email/password + Google OAuth button |

---

## Page Components

| Component | Route | Audience | Description |
|---|---|---|---|
| `HomePage` | `/` | Public | Hero search + location banner + quick links |
| `ItemLookupPage` | `/lookup` | Public | Full item search with result cards |
| `CalendarPage` | `/calendar` | Public | Pickup calendar with address input |
| `DropoffFinderPage` | `/dropoff` | Public | Map + grid center finder |
| `MedicalDropoffPage` | `/dropoff/medical` | Public | Medical/hazardous locator |
| `ImpactPage` | `/impact` | Public | Personal impact dashboard |
| `AdminDashboardPage` | `/admin` | Admin | Admin home with KPI cards |
| `RulesManagerPage` | `/admin/rules` | Admin | AG Grid rules CRUD |
| `ScheduleManagerPage` | `/admin/schedules` | Admin | Schedule upload and management |
| `CentersManagerPage` | `/admin/centers` | Admin | Drop-off centers CRUD |
| `AnalyticsPage` | `/admin/analytics` | Admin | Usage analytics dashboard |
| `LoginPage` | `/login` | Both | Auth entry point |
| `NotFoundPage` | `*` | Both | 404 page |
