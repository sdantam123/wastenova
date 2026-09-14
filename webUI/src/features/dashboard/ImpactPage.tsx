import {
  Box, Container, Typography, Card, CardContent, Grid, Chip,
  LinearProgress, Stack, Alert,
} from '@mui/material';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import BarChartIcon from '@mui/icons-material/BarChart';
import RecyclingIcon from '@mui/icons-material/Recycling';
import EmojiNatureIcon from '@mui/icons-material/EmojiNature';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import BoltIcon from '@mui/icons-material/Bolt';
import ForestIcon from '@mui/icons-material/Forest';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const monthlyData = [
  { month: 'Jan', recycled: 38, composted: 12, landfill: 55 },
  { month: 'Feb', recycled: 42, composted: 14, landfill: 50 },
  { month: 'Mar', recycled: 47, composted: 18, landfill: 48 },
  { month: 'Apr', recycled: 52, composted: 20, landfill: 42 },
  { month: 'May', recycled: 58, composted: 22, landfill: 40 },
  { month: 'Jun', recycled: 63, composted: 25, landfill: 38 },
  { month: 'Jul', recycled: 61, composted: 23, landfill: 37 },
  { month: 'Aug', recycled: 65, composted: 26, landfill: 36 },
  { month: 'Sep', recycled: 70, composted: 28, landfill: 34 },
  { month: 'Oct', recycled: 74, composted: 30, landfill: 32 },
  { month: 'Nov', recycled: 78, composted: 31, landfill: 30 },
  { month: 'Dec', recycled: 82, composted: 33, landfill: 28 },
];

const materialBreakdown = [
  { name: 'Cardboard', value: 32, color: '#8D6E63' },
  { name: 'Plastic', value: 28, color: '#42A5F5' },
  { name: 'Glass', value: 16, color: '#26C6DA' },
  { name: 'Metal', value: 12, color: '#78909C' },
  { name: 'Paper', value: 8, color: '#FFA726' },
  { name: 'Other', value: 4, color: '#AB47BC' },
];

const streaks = [
  { label: 'Consecutive pickup weeks', value: 47, max: 52 },
  { label: 'Drop-off visits this year', value: 8, max: 12 },
  { label: 'Items looked up', value: 124, max: 200 },
];

const statCards = [
  {
    label: 'CO₂ Avoided',
    value: '312 kg',
    sub: 'equivalent to driving 1,240 km',
    icon: <EmojiNatureIcon sx={{ fontSize: 36 }} />,
    color: '#2E7D32',
    bgcolor: '#E8F5E9',
  },
  {
    label: 'Water Saved',
    value: '4,280 L',
    sub: 'enough for 59 days of drinking water',
    icon: <WaterDropIcon sx={{ fontSize: 36 }} />,
    color: '#1565C0',
    bgcolor: '#E3F2FD',
  },
  {
    label: 'Energy Conserved',
    value: '218 kWh',
    sub: 'powers a home for 7 days',
    icon: <BoltIcon sx={{ fontSize: 36 }} />,
    color: '#F57F17',
    bgcolor: '#FFF8E1',
  },
  {
    label: 'Trees Equivalent',
    value: '14',
    sub: 'tree-years of carbon absorption',
    icon: <ForestIcon sx={{ fontSize: 36 }} />,
    color: '#558B2F',
    bgcolor: '#F1F8E9',
  },
];

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  color: string;
  bgcolor: string;
}

function StatCard({ label, value, sub, icon, color, bgcolor }: StatCardProps) {
  return (
    <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            width: 60, height: 60, borderRadius: 2, bgcolor,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, mb: 2,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" fontWeight={800} color={color}>
          {value}
        </Typography>
        <Typography variant="subtitle1" fontWeight={600} mt={0.5}>{label}</Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>{sub}</Typography>
      </CardContent>
    </Card>
  );
}

export function ImpactPage() {
  const totalRecycled = monthlyData.reduce((s, m) => s + m.recycled, 0);
  const avgDiversionRate = Math.round(
    monthlyData.reduce((s, m) => s + m.recycled / (m.recycled + m.composted + m.landfill), 0) /
    monthlyData.length * 100,
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 4, md: 6 } }}>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" gap={1.5} mb={1}>
            <BarChartIcon sx={{ fontSize: 36 }} />
            <Typography variant="h5" fontWeight={700}>My Recycling Impact</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'primary.light' }}>
            Your 2025 environmental impact summary based on curbside and drop-off recycling activity.
          </Typography>
          <Box display="flex" gap={2} mt={2} flexWrap="wrap">
            <Chip
              icon={<RecyclingIcon />}
              label={`${totalRecycled} kg recycled this year`}
              sx={{ bgcolor: 'primary.dark', color: 'white', fontWeight: 700 }}
            />
            <Chip
              icon={<TrendingUpIcon />}
              label={`${avgDiversionRate}% avg diversion rate`}
              sx={{ bgcolor: 'primary.dark', color: 'white', fontWeight: 700 }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Stat cards */}
        <Grid container spacing={3} mb={5}>
          {statCards.map((s) => (
            <Grid item xs={12} sm={6} md={3} key={s.label}>
              <StatCard {...s} />
            </Grid>
          ))}
        </Grid>

        {/* Monthly trend chart */}
        <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Monthly Waste Diversion (kg)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Area type="monotone" dataKey="recycled" stackId="1" stroke="#2E7D32" fill="#C8E6C9" name="Recycled" />
                <Area type="monotone" dataKey="composted" stackId="1" stroke="#795548" fill="#EFEBE9" name="Composted" />
                <Area type="monotone" dataKey="landfill" stackId="1" stroke="#9E9E9E" fill="#F5F5F5" name="Landfill" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Grid container spacing={3} mb={4}>
          {/* Material breakdown pie */}
          <Grid item xs={12} md={5}>
            <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Material Breakdown
                </Typography>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={materialBreakdown}
                      cx="50%" cy="50%"
                      innerRadius={55} outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {materialBreakdown.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v}%`, '']} />
                  </PieChart>
                </ResponsiveContainer>
                <Stack spacing={0.8} mt={1}>
                  {materialBreakdown.map((m) => (
                    <Box key={m.name} display="flex" justifyContent="space-between" alignItems="center">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: m.color }} />
                        <Typography variant="body2">{m.name}</Typography>
                      </Box>
                      <Typography variant="body2" fontWeight={600}>{m.value}%</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Bar chart per month */}
          <Grid item xs={12} md={7}>
            <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700} mb={2}>
                  Recycled vs Landfill by Month
                </Typography>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Legend />
                    <Bar dataKey="recycled" fill="#2E7D32" name="Recycled" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="landfill" fill="#BDBDBD" name="Landfill" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Streaks / milestones */}
        <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              🏆 Milestones & Streaks
            </Typography>
            <Stack spacing={2.5}>
              {streaks.map((s) => (
                <Box key={s.label}>
                  <Box display="flex" justifyContent="space-between" mb={0.5}>
                    <Typography variant="body2" fontWeight={600}>{s.label}</Typography>
                    <Typography variant="body2" color="text.secondary">{s.value} / {s.max}</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, (s.value / s.max) * 100)}
                    sx={{ height: 8, borderRadius: 4, bgcolor: '#E8F5E9', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: 4 } }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        <Alert severity="success" icon={<RecyclingIcon />}>
          <strong>Great work!</strong> Your diversion rate is above the regional average of 52%. Keep it up —
          you're on track to recycle over 900 kg this year!
        </Alert>
      </Container>
    </Box>
  );
}
