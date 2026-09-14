import {
  Box, Container, Typography, Card, CardContent, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Stack,
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const monthlyUsers = [
  { month: 'Jan', users: 3420 }, { month: 'Feb', users: 3890 },
  { month: 'Mar', users: 4210 }, { month: 'Apr', users: 4780 },
  { month: 'May', users: 5340 }, { month: 'Jun', users: 5920 },
  { month: 'Jul', users: 5680 }, { month: 'Aug', users: 6230 },
  { month: 'Sep', users: 7010 }, { month: 'Oct', users: 7840 },
  { month: 'Nov', users: 8430 }, { month: 'Dec', users: 9210 },
];

const topSearches = [
  { item: 'Battery', count: 4820, pct: 9.4 },
  { item: 'Pizza Box', count: 3910, pct: 7.6 },
  { item: 'Plastic Bag', count: 3640, pct: 7.1 },
  { item: 'Motor Oil', count: 2980, pct: 5.8 },
  { item: 'Glass Bottle', count: 2760, pct: 5.4 },
  { item: 'Styrofoam', count: 2540, pct: 4.9 },
  { item: 'Electronics', count: 2310, pct: 4.5 },
  { item: 'Medication', count: 2180, pct: 4.2 },
];

const byCategory = [
  { category: 'Curbside', pct: 54, color: '#2E7D32' },
  { category: 'Drop-off', pct: 22, color: '#F57F17' },
  { category: 'Hazardous', pct: 12, color: '#C62828' },
  { category: 'Medical', pct: 6, color: '#7B1FA2' },
  { category: 'Not Recyclable', pct: 4, color: '#9E9E9E' },
  { category: 'Compost', pct: 2, color: '#795548' },
];

const jurisdictionData = [
  { name: 'San Jose', searches: 18420, coverage: 89 },
  { name: 'Santa Clara', searches: 9870, coverage: 76 },
  { name: 'Milpitas', searches: 4320, coverage: 62 },
  { name: 'Campbell', searches: 3180, coverage: 71 },
  { name: 'Los Gatos', searches: 2640, coverage: 58 },
];

const lookupVolume = [
  { month: 'Aug', curbside: 4200, dropoff: 1800, hazardous: 920 },
  { month: 'Sep', curbside: 4580, dropoff: 2100, hazardous: 1040 },
  { month: 'Oct', curbside: 5200, dropoff: 2400, hazardous: 1180 },
  { month: 'Nov', curbside: 5840, dropoff: 2650, hazardous: 1320 },
  { month: 'Dec', curbside: 6420, dropoff: 2920, hazardous: 1480 },
];

export function AnalyticsPage() {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={3}>
        <BarChartIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>Analytics</Typography>
        <Chip icon={<TrendingUpIcon />} label="Last 12 months" size="small" color="success" variant="outlined" />
      </Box>

      {/* Monthly user growth */}
      <Card elevation={2} sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={3}>Monthly Active Users</Typography>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyUsers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v: number) => [v.toLocaleString(), 'Active Users']}
                contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="users" stroke="#2E7D32" fill="#C8E6C9" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3} mb={4}>
        {/* Lookup volume by category */}
        <Grid item xs={12} md={7}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={3}>Lookup Volume by Category</Typography>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={lookupVolume}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Legend />
                  <Bar dataKey="curbside" fill="#2E7D32" radius={[4, 4, 0, 0]} name="Curbside" />
                  <Bar dataKey="dropoff" fill="#F57F17" radius={[4, 4, 0, 0]} name="Drop-off" />
                  <Bar dataKey="hazardous" fill="#C62828" radius={[4, 4, 0, 0]} name="Hazardous" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Category distribution pie */}
        <Grid item xs={12} md={5}>
          <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Category Distribution</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={byCategory} cx="50%" cy="50%" outerRadius={75} dataKey="pct" paddingAngle={2}>
                    {byCategory.map((entry) => (
                      <Cell key={entry.category} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <Stack spacing={0.5} mt={1}>
                {byCategory.map((c) => (
                  <Box key={c.category} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={0.8}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c.color, flexShrink: 0 }} />
                      <Typography variant="body2">{c.category}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={600}>{c.pct}%</Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top searches */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Top Searched Items</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell><Typography variant="subtitle2" fontWeight={700}>Item</Typography></TableCell>
                      <TableCell align="right"><Typography variant="subtitle2" fontWeight={700}>Searches</Typography></TableCell>
                      <TableCell align="right"><Typography variant="subtitle2" fontWeight={700}>Share</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topSearches.map((row, i) => (
                      <TableRow key={row.item} hover>
                        <TableCell><Typography variant="body2" color="text.secondary">{i + 1}</Typography></TableCell>
                        <TableCell><Typography variant="body2" fontWeight={600}>{row.item}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">{row.count.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right">
                          <Chip label={`${row.pct}%`} size="small" color={i < 3 ? 'primary' : 'default'} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Jurisdiction performance */}
        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700} mb={2}>Jurisdiction Performance</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography variant="subtitle2" fontWeight={700}>City</Typography></TableCell>
                      <TableCell align="right"><Typography variant="subtitle2" fontWeight={700}>Searches</Typography></TableCell>
                      <TableCell align="right"><Typography variant="subtitle2" fontWeight={700}>Coverage</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {jurisdictionData.map((j) => (
                      <TableRow key={j.name} hover>
                        <TableCell><Typography variant="body2" fontWeight={600}>{j.name}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2">{j.searches.toLocaleString()}</Typography></TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${j.coverage}%`}
                            size="small"
                            color={j.coverage >= 80 ? 'success' : j.coverage >= 65 ? 'warning' : 'error'}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
