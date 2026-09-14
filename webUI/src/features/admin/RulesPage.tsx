import { useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button, TextField,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel,
  InputAdornment, Tooltip, Stack,
} from '@mui/material';
import RuleIcon from '@mui/icons-material/Rule';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { CategoryBadge } from '../../components/common/CategoryBadge';
import type { RecyclingCategory } from '../../types/recycling';

interface Rule {
  id: string;
  item: string;
  category: RecyclingCategory;
  jurisdiction: string;
  instruction: string;
  active: boolean;
  updatedAt: string;
}

const INITIAL_RULES: Rule[] = [
  { id: 'r1', item: 'Aluminum Can', category: 'CURBSIDE', jurisdiction: 'CA / Santa Clara County', instruction: 'Rinse and place in blue bin.', active: true, updatedAt: '2025-11-10' },
  { id: 'r2', item: 'Battery (AA/AAA)', category: 'DROPOFF_CENTER', jurisdiction: 'CA / Santa Clara County', instruction: 'Do not put in bins. Take to HHW event.', active: true, updatedAt: '2025-10-22' },
  { id: 'r3', item: 'Glass Bottle', category: 'DROPOFF_CENTER', jurisdiction: 'CA / Santa Clara County', instruction: 'Rinse and take to glass drop-off.', active: true, updatedAt: '2025-09-15' },
  { id: 'r4', item: 'Motor Oil', category: 'HAZARDOUS', jurisdiction: 'CA Statewide', instruction: 'Take to certified collection center.', active: true, updatedAt: '2025-08-30' },
  { id: 'r5', item: 'Pizza Box', category: 'CURBSIDE', jurisdiction: 'CA / San Jose', instruction: 'Lightly soiled accepted. Heavily soiled — compost.', active: true, updatedAt: '2025-11-05' },
  { id: 'r6', item: 'Styrofoam', category: 'NOT_RECYCLABLE', jurisdiction: 'CA / San Jose', instruction: 'Not accepted in any recycling program.', active: true, updatedAt: '2025-10-01' },
  { id: 'r7', item: 'Medication', category: 'MEDICAL_DROPOFF', jurisdiction: 'CA Statewide', instruction: 'Use DEA take-back site or pharmacy drop box.', active: true, updatedAt: '2025-07-14' },
  { id: 'r8', item: 'Cardboard Box', category: 'CURBSIDE', jurisdiction: 'CA / Santa Clara County', instruction: 'Flatten and place in blue bin.', active: false, updatedAt: '2025-06-20' },
];

const CATEGORIES: RecyclingCategory[] = ['CURBSIDE', 'DROPOFF_CENTER', 'HAZARDOUS', 'MEDICAL_DROPOFF', 'COMPOST', 'REUSE', 'NOT_RECYCLABLE'];

const EMPTY_RULE: Omit<Rule, 'id' | 'updatedAt'> = {
  item: '', category: 'CURBSIDE', jurisdiction: '', instruction: '', active: true,
};

export function RulesPage() {
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('ALL');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editRule, setEditRule] = useState<Rule | null>(null);
  const [form, setForm] = useState<Omit<Rule, 'id' | 'updatedAt'>>(EMPTY_RULE);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = rules.filter((r) => {
    const matchSearch = !search || r.item.toLowerCase().includes(search.toLowerCase()) || r.jurisdiction.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'ALL' || r.category === catFilter;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditRule(null);
    setForm(EMPTY_RULE);
    setDialogOpen(true);
  };

  const openEdit = (rule: Rule) => {
    setEditRule(rule);
    setForm({ item: rule.item, category: rule.category, jurisdiction: rule.jurisdiction, instruction: rule.instruction, active: rule.active });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.item || !form.jurisdiction || !form.instruction) return;
    const now = new Date().toISOString().slice(0, 10);
    if (editRule) {
      setRules((prev) => prev.map((r) => r.id === editRule.id ? { ...r, ...form, updatedAt: now } : r));
    } else {
      setRules((prev) => [...prev, { id: `r${Date.now()}`, ...form, updatedAt: now }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    setRules((prev) => prev.filter((r) => r.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <RuleIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>Recycling Rules</Typography>
          <Chip label={`${rules.length} rules`} size="small" color="primary" variant="outlined" />
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Rule
        </Button>
      </Box>

      {/* Filters */}
      <Card elevation={1} sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              size="small" placeholder="Search item or jurisdiction…"
              value={search} onChange={(e) => setSearch(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              sx={{ minWidth: 240 }}
            />
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Category</InputLabel>
              <Select value={catFilter} label="Category" onChange={(e) => setCatFilter(e.target.value)}>
                <MenuItem value="ALL">All categories</MenuItem>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c.replace('_', ' ')}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </CardContent>
      </Card>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              {['Item', 'Category', 'Jurisdiction', 'Instruction', 'Status', 'Updated', 'Actions'].map((h) => (
                <TableCell key={h}><Typography variant="subtitle2" fontWeight={700}>{h}</Typography></TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((rule) => (
              <TableRow key={rule.id} hover>
                <TableCell><Typography variant="body2" fontWeight={600}>{rule.item}</Typography></TableCell>
                <TableCell><CategoryBadge category={rule.category} size="small" /></TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{rule.jurisdiction}</Typography></TableCell>
                <TableCell sx={{ maxWidth: 280 }}>
                  <Typography variant="body2" noWrap title={rule.instruction}>{rule.instruction}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={rule.active ? 'Active' : 'Inactive'}
                    size="small"
                    color={rule.active ? 'success' : 'default'}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell><Typography variant="body2" color="text.secondary">{rule.updatedAt}</Typography></TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton size="small" onClick={() => openEdit(rule)}><EditIcon fontSize="small" /></IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" color="error" onClick={() => setDeleteId(rule.id)}><DeleteIcon fontSize="small" /></IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editRule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} mt={1}>
            <TextField
              label="Item name" fullWidth required
              value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value as RecyclingCategory })}>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c.replace('_', ' ')}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="Jurisdiction" fullWidth required
              placeholder="e.g. CA / Santa Clara County"
              value={form.jurisdiction} onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
            />
            <TextField
              label="Instruction" fullWidth required multiline rows={3}
              value={form.instruction} onChange={(e) => setForm({ ...form, instruction: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.active ? 'active' : 'inactive'} label="Status" onChange={(e) => setForm({ ...form, active: e.target.value === 'active' })}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.item || !form.jurisdiction || !form.instruction}>
            {editRule ? 'Save Changes' : 'Add Rule'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this rule? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
