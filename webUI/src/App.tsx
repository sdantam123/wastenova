import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './features/lookup/HomePage';
import { LookupResultsPage } from './features/lookup/LookupResultsPage';
import { CalendarPage } from './features/calendar/CalendarPage';
import { DropoffPage } from './features/dropoff/DropoffPage';
import { ProgramsPage } from './features/programs/ProgramsPage';
import { ImpactPage } from './features/dashboard/ImpactPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { RulesPage } from './features/admin/RulesPage';
import { CentersPage } from './features/admin/CentersPage';
import { SchedulesPage } from './features/admin/SchedulesPage';
import { AnalyticsPage } from './features/admin/AnalyticsPage';

function App() {
  return (
    <Routes>
      {/* Public layout */}
      <Route element={<AppShell variant="public" />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lookup" element={<LookupResultsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/dropoff" element={<DropoffPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/impact" element={<ImpactPage />} />
      </Route>

      {/* Auth pages (no shell) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin layout */}
      <Route element={<AppShell variant="admin" />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/rules" element={<RulesPage />} />
        <Route path="/admin/centers" element={<CentersPage />} />
        <Route path="/admin/schedules" element={<SchedulesPage />} />
        <Route path="/admin/analytics" element={<AnalyticsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
