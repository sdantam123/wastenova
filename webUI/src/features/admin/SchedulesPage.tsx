import { useState } from 'react';
import {
  Box, Container, Typography, Button, TextField,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, MenuItem, Select, FormControl, InputLabel, InputAdornment,
  Tooltip, Grid,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import RecyclingIcon from '@mui/icons-material/Recycling';
import GrassIcon from '@mui/icons-material/Grass';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface Schedule {
  id: string;
  jurisdiction: string;
  zipCodes: string;
  trashDay: string;
  recyclingDay: string;
  recyclingFrequency: 'WEEKLY' | 'BIWEEKLY';
  compostDay: string;
  bulkPickupDay: string;
  active: boolean;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const INITIAL_SCHEDULES: Schedule[] = [
  { id: 's1', jurisdiction: 'San Jose — Zone A', zipCodes: '95101, 95110, 95112', trashDay: 'Monday', recyclingDay: 'Monday', recyclingFrequency: 'BIWEEKLY', compostDay: 'Wednesday', bulkPickupDay: 'Friday', active: true },
  { id: 's2', jurisdiction: 'San Jose — Zone B', zipCodes: '95111, 95113, 95116', trashDay: 'Tuesday', recyclingDay: 'Tuesday', recyclingFrequency: 'BIWEEKLY', compostDay: 'Thursday', bulkPickupDay: 'Friday', active: true },
  { id: 's3', jurisdiction: 'Santa Clara', zipCodes: '95050, 95051, 95054', trashDay: 'Wednesday', recyclingDay: 'Wednesday', recyclingFrequency: 'WEEKLY', compostDay: 'Wednesday', bulkPickupDay: 'Tuesday', active: true },
  { id: 's4', jurisdiction: 'Milpitas', zipCodes: '95035', trashDay: 'Thursday', recyclingDay: 'Thursday', recyclingFrequency: 'BIWEEKLY', compostDay: 'Monday', bulkPickupDay: 'Wednesday', active: false },
  { id: 's5', jurisdiction: 'Campbell', zipCodes: '95008, 95031', trashDay: 'Friday', recyclingDay: 'Friday', recyclingFrequency: 'BIWEEKLY', compostDay: 'Friday', bulkPickupDay: 'Thursday', active: true },
];

const EMPTY_SCHEDULE: Omit<Schedule, 'id'> = {
  jurisdiction: '', zipCodes: '', trashDay: 'Monday',
  recyclingDay: 'Monday', recyclingFrequency: 'BIWEEKLY',
  compostDay: 'Monday', bulkPickupDay: 'Friday', active: true,
};

export function SchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Schedule, 'id'>>(EMPTY_SCHEDULE);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = schedules.filter(
    (s) => !search || s.jurisdiction.toLowerCase().includes(search.toLowerCase()) || s.zipCodes.includes(search),
  );

  const openAdd = () => { setEditId(null); setForm(EMPTY_SCHEDULE); setDialogOpen(true); };
  const openEdit = (s: Schedule) => {
    setEditId(s.id);
    setForm({ jurisdiction: s.jurisdiction, zipCodes: s.zipCodes, trashDay: s.trashDay, recyclingDay: s.recyclingDay, recyclingFrequency: s.recyclingFrequency, compostDay: s.compostDay, bulkPickupDay: s.bulkPickupDay, active: s.active });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.jurisdiction || !form.zipCodes) return;
    const entry: Schedule = { id: editId ?? `s${Date.now()}`, ...form };
    if (editId) {
      setSchedules((prev) => prev.map((s) => s.id === editId ? entry : s));
    } else {
      setSchedules((prev) => [...prev, entry]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => { setSchedules((prev) => prev.filter((s) => s.id !== deleteId)); setDeleteId(null); };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <CalendarMonthIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>Pickup Schedules</Typography>
          <Chip label={`${schedules.length} zones`} size="small" color="primary" variant="outlined" />
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>Add Schedule</Button>
      </Box>

      <TextField
        size="small" placeholder="Search jurisdiction or ZIP…" value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        sx={{ mb: 3, maxWidth: 320 }}
      />

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              {['Jurisdiction', 'ZIP Codes', 'Trash', 'Recycling', 'Compost', 'Bulk', 'Status', 'Actions'].map((h) => (
                <TableCell key={h}><Typography variant="subtitle2" fontWeight={700}>{h}</Typography></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id} hover>
                <TableCell><Typography variant="body2" fontWeight={600}>{s.jurisdiction}</Typography></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary" sx={{ maxWidth: 140, display: 'block' }}>{s.zipCodes}</Typography></TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <DeleteOutlineIcon fontSize="small" sx={{ color: '#616161' }} />
                    <Typography variant="body2">{s.trashDay}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <RecyclingIcon fontSize="small" color="primary" />
                    <Typography variant="body2">{s.recyclingDay}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">{s.recyclingFrequency === 'BIWEEKLY' ? 'Every 2 wks' : 'Weekly'}</Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <GrassIcon fontSize="small" sx={{ color: '#795548' }} />
                    <Typography variant="body2">{s.compostDay}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocalShippingIcon fontSize="small" color="info" />
                    <Typography variant="body2">{s.bulkPickupDay}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={s.active ? 'Active' : 'Inactive'} size="small" color={s.active ? 'success' : 'default'} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(s)}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => setDeleteId(s.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editId ? 'Edit Schedule' : 'Add Schedule'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField label="Jurisdiction / Zone name" fullWidth required value={form.jurisdiction} onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })} />
            <TextField label="ZIP codes (comma-separated)" fullWidth required value={form.zipCodes} onChange={(e) => setForm({ ...form, zipCodes: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Trash Day</InputLabel>
                  <Select value={form.trashDay} label="Trash Day" onChange={(e) => setForm({ ...form, trashDay: e.target.value })}>
                    {DAYS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Recycling Day</InputLabel>
                  <Select value={form.recyclingDay} label="Recycling Day" onChange={(e) => setForm({ ...form, recyclingDay: e.target.value })}>
                    {DAYS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Recycling Frequency</InputLabel>
                  <Select value={form.recyclingFrequency} label="Recycling Frequency" onChange={(e) => setForm({ ...form, recyclingFrequency: e.target.value as any })}>
                    <MenuItem value="WEEKLY">Weekly</MenuItem>
                    <MenuItem value="BIWEEKLY">Bi-weekly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Compost Day</InputLabel>
                  <Select value={form.compostDay} label="Compost Day" onChange={(e) => setForm({ ...form, compostDay: e.target.value })}>
                    {DAYS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Bulk Pickup Day</InputLabel>
                  <Select value={form.bulkPickupDay} label="Bulk Pickup Day" onChange={(e) => setForm({ ...form, bulkPickupDay: e.target.value })}>
                    {DAYS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={form.active ? 'active' : 'inactive'} label="Status" onChange={(e) => setForm({ ...form, active: e.target.value === 'active' })}>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.jurisdiction || !form.zipCodes}>
            {editId ? 'Save Changes' : 'Add Schedule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Delete Schedule?</DialogTitle>
        <DialogContent><Typography>This action cannot be undone.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
