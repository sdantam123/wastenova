import {
  Box, Container, Grid, Card, CardContent, Typography, Chip,
  Stack, Divider, LinearProgress, Paper, Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RecyclingIcon from '@mui/icons-material/Recycling';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

const weeklySearches = [
  { day: 'Mon', searches: 142 },
  { day: 'Tue', searches: 178 },
  { day: 'Wed', searches: 203 },
  { day: 'Thu', searches: 189 },
  { day: 'Fri', searches: 221 },
  { day: 'Sat', searches: 167 },
  { day: 'Sun', searches: 134 },
];

const rulesActivity = [
  { month: 'Aug', added: 4, updated: 12, deleted: 1 },
  { month: 'Sep', added: 6, updated: 9, deleted: 2 },
  { month: 'Oct', added: 3, updated: 15, deleted: 0 },
  { month: 'Nov', added: 8, updated: 11, deleted: 3 },
  { month: 'Dec', added: 5, updated: 14, deleted: 1 },
];

const recentAlerts = [
  { type: 'warning', message: 'Schedule conflict detected for ZIP 95110 on Dec 25', time: '2h ago' },
  { type: 'info', message: 'New drop-off center submitted for review: Berryessa Station', time: '4h ago' },
  { type: 'success', message: 'Bulk rule import completed — 24 rules added', time: '1d ago' },
  { type: 'warning', message: 'Center "Almaden HHW" hours not updated since Oct', time: '2d ago' },
];

const kpis = [
  { label: 'Total Residents', value: '12,480', delta: '+3.2%', icon: <PeopleIcon />, color: '#1565C0', bgcolor: '#E3F2FD' },
  { label: 'Active Rules', value: '1,847', delta: '+12', icon: <RecyclingIcon />, color: '#2E7D32', bgcolor: '#E8F5E9' },
  { label: 'Drop-off Centers', value: '38', delta: '+2', icon: <LocationOnIcon />, color: '#F57F17', bgcolor: '#FFF8E1' },
  { label: 'Schedules Live', value: '214', delta: 'Stable', icon: <CalendarMonthIcon />, color: '#7B1FA2', bgcolor: '#F3E5F5' },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <DashboardIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>Admin Dashboard</Typography>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={4}>
        {kpis.map((k) => (
          <Grid item xs={12} sm={6} md={3} key={k.label}>
            <Card elevation={2} sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  sx={{
                    width: 44, height: 44, borderRadius: 2,
                    bgcolor: k.bgcolor, color: k.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  {k.icon}
                </Box>
                <Typography variant="h5" fontWeight={800}>{k.value}</Typography>
                <Typography variant="body2" color="text.secondary" mt={0.3}>{k.label}</Typography>
                <Chip
                  icon={<TrendingUpIcon fontSize="small" />}
                  label={k.delta}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ mt: 1, fontWeight: 600 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mb={4}>
        {/* Weekly searches */}
        <Grid item xs={12} md={7}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Resident Lookup Activity (This Week)
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={weeklySearches}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="searches" fill="#2E7D32" radius={[4, 4, 0, 0]} name="Searches" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Rules activity */}
        <Grid item xs={12} md={5}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Rules Activity (Last 5 Months)
              </Typography>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={rulesActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Line type="monotone" dataKey="added" stroke="#2E7D32" strokeWidth={2} dot={false} name="Added" />
                  <Line type="monotone" dataKey="updated" stroke="#1565C0" strokeWidth={2} dot={false} name="Updated" />
                  <Line type="monotone" dataKey="deleted" stroke="#C62828" strokeWidth={2} dot={false} name="Deleted" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Alerts */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                System Alerts
              </Typography>
              <Stack spacing={1.5}>
                {recentAlerts.map((a, i) => (
                  <Paper
                    key={i}
                    variant="outlined"
                    sx={{
                      p: 1.5, borderRadius: 2,
                      borderColor: a.type === 'warning' ? 'warning.main' : a.type === 'success' ? 'success.main' : 'info.main',
                    }}
                  >
                    <Box display="flex" alignItems="flex-start" gap={1}>
                      {a.type === 'warning'
                        ? <WarningAmberIcon fontSize="small" color="warning" sx={{ mt: 0.2 }} />
                        : a.type === 'success'
                        ? <CheckCircleIcon fontSize="small" color="success" sx={{ mt: 0.2 }} />
                        : <RecyclingIcon fontSize="small" color="info" sx={{ mt: 0.2 }} />
                      }
                      <Box>
                        <Typography variant="body2">{a.message}</Typography>
                        <Typography variant="caption" color="text.secondary">{a.time}</Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick actions */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={2}>
                Quick Actions
              </Typography>
              <Stack spacing={1.5}>
                {[
                  { label: 'Add Recycling Rule', path: '/admin/rules', color: 'primary' },
                  { label: 'Register New Center', path: '/admin/centers', color: 'warning' },
                  { label: 'Update Schedule', path: '/admin/schedules', color: 'info' },
                  { label: 'View Analytics', path: '/admin/analytics', color: 'success' },
                ].map((a) => (
                  <Button
                    key={a.label}
                    variant="outlined"
                    color={a.color as any}
                    fullWidth
                    onClick={() => navigate(a.path)}
                    sx={{ justifyContent: 'flex-start', fontWeight: 600 }}
                  >
                    {a.label}
                  </Button>
                ))}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                Coverage by State
              </Typography>
              {[
                { state: 'California', coverage: 87 },
                { state: 'Texas', coverage: 62 },
                { state: 'New York', coverage: 74 },
                { state: 'Florida', coverage: 55 },
              ].map((s) => (
                <Box key={s.state} mb={1.5}>
                  <Box display="flex" justifyContent="space-between" mb={0.3}>
                    <Typography variant="caption">{s.state}</Typography>
                    <Typography variant="caption" fontWeight={600}>{s.coverage}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate" value={s.coverage}
                    sx={{ height: 6, borderRadius: 3, bgcolor: '#E8F5E9', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
