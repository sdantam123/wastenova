import { useState, useCallback, useRef, useEffect } from 'react';
import {
  GoogleMap, MarkerF as Marker, InfoWindow,
} from '@react-google-maps/api';
import {
  Box, Typography, Chip, Stack,
  CircularProgress, Alert,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RecyclingIcon from '@mui/icons-material/Recycling';
import DirectionsIcon from '@mui/icons-material/Directions';
import type { DropoffCenter } from '../../types/recycling';
import { getDirectionsUrl } from '../../utils/directionsUrl';

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };
const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };

interface DropoffMapProps {
  centers: DropoffCenter[];
  userCoords: { lat: number; lng: number } | null;
  onCenterSelect: (id: number) => void;
  selectedId: number | null;
  isLoaded: boolean;
  loadError: Error | undefined;
}

export function DropoffMap({ centers, userCoords, onCenterSelect, selectedId, isLoaded, loadError }: DropoffMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const fitToMarkers = useCallback((map: google.maps.Map) => {
    const points = [
      ...(userCoords ? [userCoords] : []),
      ...centers.map((c) => ({ lat: c.location?.lat ?? c.lat ?? 0, lng: c.location?.lng ?? c.lng ?? 0 })),
    ];
    if (points.length === 0) return;
    if (points.length === 1) {
      map.setCenter(points[0]);
      map.setZoom(12);
      return;
    }
    const bounds = new google.maps.LatLngBounds();
    points.forEach((p) => bounds.extend(p));
    map.fitBounds(bounds, 48);
  }, [centers, userCoords]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    // The map can initialize before its flex layout container has settled on
    // a final size, leaving Google's internal viewport collapsed to a point
    // so markers project to the wrong pixel. Nudge it once the container has
    // painted so it recomputes against the real container size.
    window.setTimeout(() => {
      const currentMap = mapRef.current;
      if (!currentMap) return;
      google.maps.event.trigger(currentMap, 'resize');
      fitToMarkers(currentMap);
    }, 200);
  }, [fitToMarkers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    fitToMarkers(map);
  }, [fitToMarkers]);

  if (!apiKey) {
    return (
      <Box
        sx={{
          height: '100%', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          bgcolor: '#e8f5e9', borderRadius: 2, p: 3,
        }}
      >
        <RecyclingIcon sx={{ fontSize: 56, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" fontWeight={700} color="primary.dark" textAlign="center">
          Map View
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={1} maxWidth={280}>
          Add a <code>VITE_GOOGLE_MAPS_API_KEY</code> environment variable to enable the interactive map.
          Drop-off locations are listed in the panel on the left.
        </Typography>
        <Alert severity="info" sx={{ mt: 3, textAlign: 'left', width: '100%', maxWidth: 360 }}>
          <strong>Centers nearby:</strong> {centers.length} locations found
        </Alert>
        {/* Static "map" visualization */}
        <Box
          sx={{
            mt: 3, width: '100%', maxWidth: 400, height: 200,
            borderRadius: 2, overflow: 'hidden', position: 'relative',
            border: '1px solid', borderColor: 'divider',
          }}
        >
          <Box sx={{ bgcolor: '#c8e6c9', width: '100%', height: '100%', position: 'relative' }}>
            {centers.slice(0, 8).map((c, i) => (
              <Box
                key={c.id}
                onClick={() => onCenterSelect(c.id)}
                sx={{
                  position: 'absolute',
                  left: `${10 + (i * 45) % 80}%`,
                  top: `${15 + (i * 37) % 65}%`,
                  transform: 'translate(-50%,-50%)',
                  cursor: 'pointer',
                }}
              >
                <LocationOnIcon
                  sx={{
                    color: selectedId === c.id ? '#C62828' : '#2E7D32',
                    fontSize: selectedId === c.id ? 32 : 24,
                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  if (loadError) {
    return (
      <Alert severity="error">
        Could not load Google Maps. Check your API key and network connection.
      </Alert>
    );
  }

  if (!isLoaded) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" height="100%">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const mapCenter = userCoords ?? (centers[0] ? { lat: centers[0].location?.lat ?? centers[0].lat ?? DEFAULT_CENTER.lat, lng: centers[0].location?.lng ?? centers[0].lng ?? DEFAULT_CENTER.lng } : DEFAULT_CENTER);

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONTAINER_STYLE}
      center={mapCenter}
      zoom={12}
      onLoad={onMapLoad}
      options={{
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      }}
    >
      {/* User location marker */}
      {userCoords && (
        <Marker
          position={userCoords}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#1565C0',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          }}
        />
      )}

      {/* Drop-off center markers */}
      {centers.map((center) => (
        <Marker
          key={center.id}
          position={{ lat: center.location?.lat ?? center.lat ?? 0, lng: center.location?.lng ?? center.lng ?? 0 }}
          title={center.name}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24S32 28 32 16C32 7.163 24.837 0 16 0z"
                  fill="${selectedId === center.id ? '#C62828' : '#2E7D32'}" />
                <circle cx="16" cy="16" r="8" fill="white"/>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(32, 40),
            anchor: new google.maps.Point(16, 40),
          }}
          onClick={() => {
            setActiveMarker(center.id);
            onCenterSelect(center.id);
          }}
        />
      ))}

      {/* Info window */}
      {activeMarker && (() => {
        const c = centers.find((x) => x.id === activeMarker);
        if (!c) return null;
        return (
          <InfoWindow
            position={{ lat: c.location?.lat ?? c.lat ?? 0, lng: c.location?.lng ?? c.lng ?? 0 }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <Box sx={{ minWidth: 180, maxWidth: 240 }}>
              <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                {c.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="caption">{c.address}</Typography>
              </Box>
              <Box mb={0.5}>
                <Chip
                  component="a"
                  href={getDirectionsUrl({ lat: c.lat, lng: c.lng, address: c.address })}
                  target="_blank"
                  rel="noopener noreferrer"
                  clickable
                  icon={<DirectionsIcon />}
                  label="Directions"
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              {c.phone && (
                <Box display="flex" alignItems="center" gap={0.5} mb={0.5}>
                  <PhoneIcon fontSize="small" color="action" />
                  <Typography variant="caption">{c.phone}</Typography>
                </Box>
              )}
              <Stack direction="row" flexWrap="wrap" gap={0.5} mt={1}>
                {c.acceptedMaterials.slice(0, 4).map((m) => (
                  <Chip key={m} label={m.replace('_', ' ')} size="small" color="primary" variant="outlined" />
                ))}
                {c.acceptedMaterials.length > 4 && (
                  <Chip label={`+${c.acceptedMaterials.length - 4} more`} size="small" variant="outlined" />
                )}
              </Stack>
            </Box>
          </InfoWindow>
        );
      })()}
    </GoogleMap>
  );
}
