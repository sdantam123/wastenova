import { useMemo, useState } from 'react';
import {
  Box, Container, Typography, Card, CardContent, Button, TextField,
  Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Stack, Grid, Divider, InputAdornment, Tooltip, FormControl,
  InputLabel, MenuItem, Select, CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import PublicIcon from '@mui/icons-material/Public';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  useCreateCenterMutation,
  useDeleteCenterMutation,
  useGetAdminCentersQuery,
  useUpdateCenterMutation,
  type NewCenterPayload,
  type ServerDropoffCenter,
} from '../../api/recycleApi';

const ALL_MATERIALS = ['PLASTIC', 'GLASS', 'METAL', 'PAPER', 'CARDBOARD', 'ELECTRONICS', 'BATTERIES', 'PAINT', 'MEDICATIONS', 'MOTOR_OIL', 'TEXTILES', 'ORGANIC', 'SHARPS'];
const CENTER_TYPES = ['MUNICIPAL_CENTER', 'COUNTY_CENTER', 'RETAIL_DROPOFF', 'PHARMACY_DROPBOX', 'EWASTE_EVENT'];

const materialLabel: Record<string, string> = {
  PLASTIC: 'Plastic', GLASS: 'Glass', METAL: 'Metal', PAPER: 'Paper',
  CARDBOARD: 'Cardboard', ELECTRONICS: 'E-Waste', BATTERIES: 'Batteries',
  PAINT: 'Paint', MEDICATIONS: 'Medications', MOTOR_OIL: 'Motor Oil',
  TEXTILES: 'Textiles', ORGANIC: 'Compost', SHARPS: 'Sharps',
};

type FormData = {
  name: string;
  center_type: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
  latitude: string;
  longitude: string;
  phone: string;
  website: string;
  email: string;
  accepted_materials: string[];
  not_accepted: string[];
  is_active: boolean;
};

const EMPTY_FORM: FormData = {
  name: '', center_type: 'MUNICIPAL_CENTER', address_line1: '', address_line2: '', city: '', state: '', postal_code: '',
  country_code: 'US', latitude: '', longitude: '', phone: '', website: '', email: '', accepted_materials: [], not_accepted: [], is_active: true,
};

function toFormData(center: ServerDropoffCenter): FormData {
  return {
    name: center.name,
    center_type: center.center_type,
    address_line1: center.address_line1,
    address_line2: center.address_line2 ?? '',
    city: center.city,
    state: center.state ?? '',
    postal_code: center.postal_code ?? '',
    country_code: center.country_code,
    latitude: String(center.latitude),
    longitude: String(center.longitude),
    phone: center.phone ?? '',
    website: center.website ?? '',
    email: center.email ?? '',
    accepted_materials: center.accepted_materials ?? [],
    not_accepted: center.not_accepted ?? [],
    is_active: center.is_active ?? true,
  };
}

export function CentersPage() {
  const { data: centers = [], isLoading, isError } = useGetAdminCentersQuery();
  const [createCenter] = useCreateCenterMutation();
  const [updateCenter] = useUpdateCenterMutation();
  const [deleteCenter] = useDeleteCenterMutation();

  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search) return centers;
    const term = search.toLowerCase();
    return centers.filter((center) => {
      const address = [center.address_line1, center.address_line2, center.city, center.state, center.postal_code].filter(Boolean).join(', ').toLowerCase();
      return center.name.toLowerCase().includes(term) || address.includes(term);
    });
  }, [centers, search]);

  const openAdd = () => {
    setEditId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (center: ServerDropoffCenter) => {
    setEditId(center.id);
    setForm(toFormData(center));
    setDialogOpen(true);
  };

  const toggleMaterial = (material: string) => {
    setForm((current) => ({
      ...current,
      accepted_materials: current.accepted_materials.includes(material)
        ? current.accepted_materials.filter((item) => item !== material)
        : [...current.accepted_materials, material],
    }));
  };

  const handleSave = async () => {
    if (!form.name || !form.address_line1 || !form.city || !form.latitude || !form.longitude) return;

    const payload: NewCenterPayload = {
      name: form.name,
      center_type: form.center_type,
      address_line1: form.address_line1,
      address_line2: form.address_line2 || null,
      city: form.city,
      state: form.state || null,
      postal_code: form.postal_code || null,
      country_code: form.country_code || 'US',
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      phone: form.phone || null,
      website: form.website || null,
      email: form.email || null,
      accepted_materials: form.accepted_materials,
      not_accepted: form.not_accepted.length ? form.not_accepted : null,
      is_active: form.is_active,
    };

    if (editId) {
      await updateCenter({ id: editId, payload }).unwrap();
    } else {
      await createCenter(payload).unwrap();
    }

    setDialogOpen(false);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteCenter(deleteId).unwrap();
    setDeleteId(null);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocationOnIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>Drop-off Centers</Typography>
          <Chip label={`${centers.length} centers`} size="small" color="primary" variant="outlined" />
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
          Add Center
        </Button>
      </Box>

      <TextField
        size="small"
        placeholder="Search center or city…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
        sx={{ mb: 3, maxWidth: 320 }}
      />

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      ) : isError ? (
        <Card><CardContent><Typography color="error">Unable to load centers from the server.</Typography></CardContent></Card>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((center) => (
            <Grid item xs={12} md={6} lg={4} key={center.id}>
              <Card elevation={2} sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="subtitle1" fontWeight={700}>{center.name}</Typography>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(center)}><EditIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => setDeleteId(center.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="flex-start" gap={0.5} mb={0.5}>
                    <LocationOnIcon fontSize="small" color="action" sx={{ flexShrink: 0, mt: 0.2 }} />
                    <Typography variant="body2" color="text.secondary">
                      {[center.address_line1, center.address_line2, center.city, center.state, center.postal_code].filter(Boolean).join(', ')}
                    </Typography>
                  </Box>

                  {center.phone && (
                    <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">{center.phone}</Typography>
                    </Box>
                  )}

                  {center.website && (
                    <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                      <PublicIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">{center.website}</Typography>
                    </Box>
                  )}

                  {center.not_accepted && center.not_accepted.length > 0 && (
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Not accepted: {center.not_accepted.join(', ')}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={0.8}>
                    ACCEPTED MATERIALS
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {center.accepted_materials.map((material) => (
                      <Chip
                        key={material}
                        label={materialLabel[material] ?? material}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={700}>{editId ? 'Edit Center' : 'Add New Center'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Center name" fullWidth required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <FormControl fullWidth>
                <InputLabel>Center type</InputLabel>
                <Select value={form.center_type} label="Center type" onChange={(e) => setForm({ ...form, center_type: e.target.value })}>
                  {CENTER_TYPES.map((type) => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Address line 1" fullWidth required value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} />
              <TextField label="Address line 2" fullWidth value={form.address_line2} onChange={(e) => setForm({ ...form, address_line2: e.target.value })} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="City" fullWidth required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <TextField label="State" fullWidth value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              <TextField label="Postal code" fullWidth value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Country code" fullWidth value={form.country_code} onChange={(e) => setForm({ ...form, country_code: e.target.value.toUpperCase() })} />
              <TextField label="Latitude" type="number" fullWidth required value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
              <TextField label="Longitude" type="number" fullWidth required value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <TextField label="Website" fullWidth value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              <TextField label="Email" fullWidth value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Stack>

            <Box>
              <Typography variant="subtitle2" fontWeight={600} mb={1}>Accepted Materials</Typography>
              <Box display="flex" flexWrap="wrap" gap={0.8}>
                {ALL_MATERIALS.map((material) => (
                  <Chip
                    key={material}
                    label={materialLabel[material] ?? material}
                    size="small"
                    clickable
                    onClick={() => toggleMaterial(material)}
                    color={form.accepted_materials.includes(material) ? 'primary' : 'default'}
                    variant={form.accepted_materials.includes(material) ? 'filled' : 'outlined'}
                    icon={form.accepted_materials.includes(material) ? <CheckCircleIcon /> : undefined}
                  />
                ))}
              </Box>
            </Box>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={form.is_active ? 'active' : 'inactive'} label="Status" onChange={(e) => setForm({ ...form, is_active: e.target.value === 'active' })}>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || !form.address_line1 || !form.city || !form.latitude || !form.longitude}>
            {editId ? 'Save Changes' : 'Add Center'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this drop-off center? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
