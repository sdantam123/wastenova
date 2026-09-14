# Routing — Recycle Compass Web UI

## Router Setup

React Router v6 with nested routes and lazy-loaded page components via `React.lazy()`.

```tsx
// src/App.tsx
<BrowserRouter>
  <Routes>
    {/* Public routes — AppShell without sidebar */}
    <Route element={<AppShell variant="public" />}>
      <Route index element={<HomePage />} />
      <Route path="lookup" element={<ItemLookupPage />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="dropoff" element={<DropoffFinderPage />} />
      <Route path="dropoff/medical" element={<MedicalDropoffPage />} />
      <Route path="impact" element={<ImpactPage />} />
    </Route>

    {/* Auth routes */}
    <Route path="login" element={<LoginPage />} />

    {/* Admin routes — require auth + AppShell with sidebar */}
    <Route path="admin" element={<RequireAuth><AppShell variant="admin" /></RequireAuth>}>
      <Route index element={<AdminDashboardPage />} />
      <Route path="rules" element={<RulesManagerPage />} />
      <Route path="schedules" element={<ScheduleManagerPage />} />
      <Route path="centers" element={<CentersManagerPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

---

## Route Inventory

### Public Routes

| Path | Page Component | Description |
|---|---|---|
| `/` | `HomePage` | Landing page — item search hero + quick links |
| `/lookup` | `ItemLookupPage` | Item recycling lookup results |
| `/lookup?item={name}` | `ItemLookupPage` | Pre-filled search from URL param |
| `/lookup?item={name}&zip={zip}` | `ItemLookupPage` | Pre-filled with location override |
| `/calendar` | `CalendarPage` | Curbside pickup calendar |
| `/calendar?address={addr}` | `CalendarPage` | Calendar for specific address |
| `/dropoff` | `DropoffFinderPage` | Drop-off center finder map + list |
| `/dropoff?material={type}` | `DropoffFinderPage` | Pre-filtered by material type |
| `/dropoff/medical` | `MedicalDropoffPage` | Medical & hazardous drop-off locator |
| `/dropoff/medical?type={sub}` | `MedicalDropoffPage` | Pre-selected sub-category (rx/sharps/batteries) |
| `/impact` | `ImpactPage` | Personal impact dashboard |
| `/login` | `LoginPage` | Authentication entry point |

### Admin Routes (Auth Required)

| Path | Page Component | Role Required | Description |
|---|---|---|---|
| `/admin` | `AdminDashboardPage` | `MUNICIPALITY_MANAGER` | Admin home with KPI summary |
| `/admin/rules` | `RulesManagerPage` | `MUNICIPALITY_MANAGER` | AG Grid recycling rules CRUD |
| `/admin/schedules` | `ScheduleManagerPage` | `MUNICIPALITY_MANAGER` | Pickup schedule upload + management |
| `/admin/centers` | `CentersManagerPage` | `MUNICIPALITY_MANAGER` | Drop-off center registry CRUD |
| `/admin/analytics` | `AnalyticsPage` | `ADMIN` | Cross-jurisdiction analytics |

---

## URL Query Parameter Conventions

| Parameter | Used On | Description |
|---|---|---|
| `item` | `/lookup` | Item name to pre-search |
| `zip` | `/lookup`, `/calendar`, `/dropoff` | Zip/postal code location override |
| `lat` / `lng` | `/dropoff` | Map center coordinates |
| `material` | `/dropoff` | Pre-selected material filter chip |
| `type` | `/dropoff/medical` | Medical sub-category: `rx \| sharps \| batteries \| paint` |
| `radius` | `/dropoff` | Search radius in miles: `5 \| 10 \| 25` |
| `address` | `/calendar` | Street address for schedule lookup |
| `view` | `/dropoff` | `map \| list` — default view mode |

---

## Deep-Link Examples

```
# Look up battery recycling in Jersey City
/lookup?item=battery&zip=07302

# Find paint drop-off centers near a location
/dropoff?material=PAINT&lat=40.71&lng=-74.01&radius=10

# View pickup calendar for a specific address
/calendar?address=123+Main+St+Jersey+City+NJ

# Medical drop-off for prescription medications
/dropoff/medical?type=rx&zip=07302
```

---

## Route Guards

### `RequireAuth` Component
```tsx
const RequireAuth = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingOverlay loading />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.roles.includes('MUNICIPALITY_MANAGER') && !user.roles.includes('ADMIN')) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
```

### Post-Login Redirect
After successful login, the user is redirected back to the originally requested URL using `location.state.from`.

---

## Code Splitting

All page components are lazy-loaded to minimize initial bundle size:

```tsx
const ItemLookupPage     = lazy(() => import('./features/lookup/ItemLookupPage'));
const CalendarPage       = lazy(() => import('./features/calendar/CalendarPage'));
const DropoffFinderPage  = lazy(() => import('./features/dropoff/DropoffFinderPage'));
const RulesManagerPage   = lazy(() => import('./features/admin/RulesManagerPage'));
const AnalyticsPage      = lazy(() => import('./features/admin/AnalyticsPage'));
// ...wrapped in <Suspense fallback={<LoadingOverlay loading />}>
```

---

## Navigation Structure

### Public TopBar Navigation
```
[Recycle Compass Logo]    Lookup  |  Calendar  |  Drop-off  |  Impact     [📍 Jersey City, NJ]  [Login]
```

### Admin Sidebar Navigation
```
┌─────────────────────┐
│ 🧭 Recycle Compass  │
│ Admin Portal        │
├─────────────────────┤
│ 📊 Dashboard        │
│ 📋 Rules            │
│ 📅 Schedules        │
│ 📍 Centers          │
│ 📈 Analytics        │
├─────────────────────┤
│ ⚙️  Settings        │
│ 🚪 Logout           │
└─────────────────────┘
```

---

## Breadcrumb Pattern

Admin pages display MUI Breadcrumbs:
```
Admin > Rules > Hudson County, NJ
Admin > Centers > Add New Center
Admin > Schedules > Upload
```
