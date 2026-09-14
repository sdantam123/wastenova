import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box, Typography,
  Chip, Accordion, AccordionSummary, AccordionDetails,
  Stack, Alert, CircularProgress,
  List, ListItem, ListItemText, Divider, Link as MuiLink,
  Autocomplete, TextField,
} from '@mui/material';
import { useJsApiLoader } from '@react-google-maps/api';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsIcon from '@mui/icons-material/Directions';
import SearchIcon from '@mui/icons-material/Search';
import { useGetProgramsQuery, useSearchCentersQuery, useGetSourceDocumentsQuery, apiOrigin } from '../../api/recycleApi';
import type { ServerRecyclingProgram } from '../../api/recycleApi';
import type { DropoffCenter, DropoffCenterHoursEntry } from '../../types/recycling';
import { categoryNavItems, type CategoryNavItem } from './categoryNav';
import { DropoffMap } from '../../components/maps/DropoffMap';
import { useAppSelector } from '../../store/store';
import { getDirectionsUrl } from '../../utils/directionsUrl';

const GOOGLE_MAPS_LIBRARIES: 'places'[] = ['places'];

const programTypeMeta: Record<string, { label: string; icon: JSX.Element; color: 'info' | 'success' | 'warning' | 'default' }> = {
  MAIL_IN: { label: 'Mail-in', icon: <LocalShippingIcon fontSize="small" />, color: 'info' },
  RETAIL_TAKEBACK: { label: 'Retail take-back', icon: <StorefrontIcon fontSize="small" />, color: 'success' },
  LOCAL_EVENT: { label: 'Local event', icon: <EventIcon fontSize="small" />, color: 'warning' },
  MUNICIPAL: { label: 'Municipal / county', icon: <AccountBalanceIcon fontSize="small" />, color: 'default' },
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Matches each keyword only at a word boundary (start of a word), so
 * "tire" matches "tires" / "Tire Recycling" but not "attire". Keywords
 * are otherwise allowed to match partway through a word (e.g. "batter"
 * intentionally matches both "battery" and "batteries").
 */
function matchesKeywords(haystacks: Array<string | null | undefined>, keywords: string[]): boolean {
  const text = haystacks.filter(Boolean).join(' ').toLowerCase();
  return keywords.some((kw) => new RegExp(`\\b${escapeRegExp(kw)}`, 'i').test(text));
}

function ProgramCard({ program }: { program: ServerRecyclingProgram }) {
  const meta = programTypeMeta[program.program_type] ?? programTypeMeta.MUNICIPAL;

  return (
    <Accordion elevation={0} sx={{ border: '1px solid', borderColor: 'divider', '&:before': { display: 'none' } }} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%', flexWrap: 'wrap', rowGap: 1 }}>
          <Chip icon={meta.icon} label={meta.label} size="small" color={meta.color === 'default' ? undefined : meta.color} variant="outlined" />
          <Box sx={{ flexGrow: 1, minWidth: 200 }}>
            <Typography variant="subtitle1" fontWeight={700}>{program.program_name}</Typography>
            <Typography variant="body2" color="text.secondary">{program.organization}</Typography>
          </Box>
          {program.incentive && (
            <Chip label={program.incentive} size="small" color="success" sx={{ fontWeight: 600 }} />
          )}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1.5}>
          {program.how_it_works && (
            <Typography variant="body2">{program.how_it_works}</Typography>
          )}

          {program.accepts && program.accepts.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">ACCEPTS</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5} mt={0.5}>
                {program.accepts.map((item) => (
                  <Chip key={item} label={item} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          {program.not_accepted && program.not_accepted.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">NOT ACCEPTED</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5} mt={0.5}>
                {program.not_accepted.map((item) => (
                  <Chip key={item} label={item} size="small" variant="outlined" color="error" />
                ))}
              </Stack>
            </Box>
          )}

          {program.website && (
            <MuiLink href={program.website.startsWith('http') ? program.website : `https://${program.website}`} target="_blank" rel="noopener noreferrer" variant="body2">
              {program.website}
            </MuiLink>
          )}

          {program.locations.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">LOCATIONS</Typography>
              <List dense disablePadding>
                {program.locations.map((loc, idx) => {
                  const address = [loc.address_line1, loc.city, loc.state, loc.postal_code].filter(Boolean).join(', ');
                  return (
                    <ListItem key={`${loc.location_name}-${idx}`} disableGutters sx={{ py: 0.5, display: 'block' }}>
                      <Stack direction="row" alignItems="flex-start" spacing={1}>
                        <LocationOnIcon fontSize="small" color="action" sx={{ mt: '2px' }} />
                        <ListItemText
                          primary={loc.location_name}
                          secondary={address || loc.notes || undefined}
                        />
                      </Stack>
                      {(address || loc.notes) && (
                        <Chip
                          component="a"
                          href={getDirectionsUrl({ lat: loc.latitude ?? undefined, lng: loc.longitude ?? undefined, address: address || loc.location_name })}
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                          icon={<DirectionsIcon />}
                          label="Directions"
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 700, ml: 4, mt: 0.5 }}
                        />
                      )}
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

const hourDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Notes on recurring drop-off hours are written as "<service>, <week detail>"
 * (e.g. "Paint drop-off, 1st Saturday of month"). Pulls out just the part
 * after the comma so it can be shown alongside the day/time instead of the
 * whole sentence.
 */
function extractWeekDetail(notes: string | null): string | null {
  if (!notes) return null;
  const commaIndex = notes.indexOf(',');
  if (commaIndex === -1) return null;
  return notes.slice(commaIndex + 1).trim() || null;
}

function formatHoursEntry(entry: DropoffCenterHoursEntry): string {
  const day = hourDayNames[entry.dayOfWeek] ?? `Day ${entry.dayOfWeek}`;
  const time = entry.openTime && entry.closeTime
    ? `${entry.openTime.slice(0, 5)}-${entry.closeTime.slice(0, 5)}`
    : (entry.notes ?? 'Closed');
  const weekDetail = entry.openTime && entry.closeTime ? extractWeekDetail(entry.notes) : null;
  return weekDetail ? `${day}: ${time} (${weekDetail})` : `${day}: ${time}`;
}

const ordinalWords = ['1st', '2nd', '3rd', '4th', '5th'];

/** Which occurrence of its weekday today is within the current month, e.g. the 2nd Saturday. */
function nthWeekdayOccurrenceOfMonth(date: Date): number {
  return Math.floor((date.getDate() - 1) / 7) + 1;
}

function mentionedOrdinalsIn(entry: DropoffCenterHoursEntry): string[] {
  const weekDetail = extractWeekDetail(entry.notes);
  if (!weekDetail) return [];
  return ordinalWords.filter((word) => new RegExp(`\\b${word}\\b`, 'i').test(weekDetail));
}

/**
 * A week-detail string like "1st Saturday of month" or "1st and 3rd Saturday
 * only" restricts an hours row to specific occurrences of its weekday. Rows
 * with no such ordinal (e.g. plain "Mon-Fri" hours, or seasonal-only notes
 * like "April 1-November 30 only") aren't week-restricted, so they always
 * count as current.
 */
function matchesCurrentWeek(entry: DropoffCenterHoursEntry, today: Date): boolean {
  const mentionedOrdinals = mentionedOrdinalsIn(entry);
  if (mentionedOrdinals.length === 0) return true;
  if (entry.dayOfWeek !== today.getDay()) return false;
  const currentOrdinal = ordinalWords[nthWeekdayOccurrenceOfMonth(today) - 1];
  return mentionedOrdinals.includes(currentOrdinal);
}

function relevantHoursFor(hoursDetail: DropoffCenterHoursEntry[] | undefined, categoryKeywords: string[] | undefined): DropoffCenterHoursEntry[] {
  if (!hoursDetail || hoursDetail.length === 0) return [];
  const relevant = categoryKeywords && categoryKeywords.length > 0
    ? hoursDetail.filter((entry) => matchesKeywords([entry.notes], categoryKeywords))
    : hoursDetail;
  return relevant.length > 0 ? relevant : hoursDetail;
}

/** True only if the center has at least one relevant hours row restricted to specific week(s) of the month (e.g. "1st Saturday"). Centers open every week aren't week-restricted, so this is false for them even though they're always "current". */
function isWeekRestricted(hoursDetail: DropoffCenterHoursEntry[] | undefined, categoryKeywords: string[] | undefined): boolean {
  return relevantHoursFor(hoursDetail, categoryKeywords).some((entry) => mentionedOrdinalsIn(entry).length > 0);
}

/** True if any of a center's hours relevant to the active category fall in the current week's rotation. */
function isCenterActiveThisWeek(hoursDetail: DropoffCenterHoursEntry[] | undefined, categoryKeywords: string[] | undefined, today: Date): boolean {
  const candidates = relevantHoursFor(hoursDetail, categoryKeywords);
  if (candidates.length === 0) return false;
  return candidates.some((entry) => matchesCurrentWeek(entry, today));
}

const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

/**
 * Parses a "<Month> <day>-<Month> <day> only" seasonal restriction out of an
 * hours row's notes (e.g. "Tire recycling, April 1-November 30 only"). The
 * range can wrap the year boundary (e.g. December-March). Returns null if
 * the notes don't contain a recognizable range, meaning the row applies
 * year-round.
 */
function seasonalRangeIn(entry: DropoffCenterHoursEntry): { startMonth: number; startDay: number; endMonth: number; endDay: number } | null {
  if (!entry.notes) return null;
  const match = entry.notes.match(/([A-Za-z]+)\s+(\d{1,2})\s*-\s*([A-Za-z]+)\s+(\d{1,2})/);
  if (!match) return null;
  const startMonth = monthNames.indexOf(match[1].toLowerCase());
  const endMonth = monthNames.indexOf(match[3].toLowerCase());
  if (startMonth === -1 || endMonth === -1) return null;
  return { startMonth, startDay: Number(match[2]), endMonth, endDay: Number(match[4]) };
}

function isWithinSeasonalRange(entry: DropoffCenterHoursEntry, today: Date): boolean {
  const range = seasonalRangeIn(entry);
  if (!range) return true;
  const month = today.getMonth();
  const day = today.getDate();
  const value = month * 100 + day;
  const start = range.startMonth * 100 + range.startDay;
  const end = range.endMonth * 100 + range.endDay;
  return start <= end ? (value >= start && value <= end) : (value >= start || value <= end);
}

/**
 * Resolves the hours row(s) that actually apply right now for this center
 * (matching day-of-week, week-of-month rotation, and seasonal date range),
 * so "today's hours" can be shown as a single clear line instead of the
 * full multi-row schedule (which mixes in other days/seasons/materials).
 */
function todaysHoursFor(hoursDetail: DropoffCenterHoursEntry[] | undefined, categoryKeywords: string[] | undefined, today: Date): DropoffCenterHoursEntry[] {
  const candidates = relevantHoursFor(hoursDetail, categoryKeywords);
  return candidates.filter((entry) => (
    entry.dayOfWeek === today.getDay()
    && matchesCurrentWeek(entry, today)
    && isWithinSeasonalRange(entry, today)
  ));
}

/**
 * True if a center's relevant hours only ever occur on a subset of weekdays
 * (e.g. Wednesdays only), rather than most/every day. For centers like this,
 * "Closed today" on an off-day is misleading noise — we'd rather point to
 * the next day they're actually open.
 */
function isWeeklyOnlySchedule(hoursDetail: DropoffCenterHoursEntry[] | undefined, categoryKeywords: string[] | undefined): boolean {
  const candidates = relevantHoursFor(hoursDetail, categoryKeywords);
  if (candidates.length === 0) return false;
  const daysOpen = new Set(candidates.map((entry) => entry.dayOfWeek));
  return daysOpen.size > 0 && daysOpen.size <= 3;
}

/**
 * Finds the soonest future date (checking today first, then up to the next
 * 2 months) on which any relevant hours row actually applies — matching
 * day-of-week, week-of-month rotation, and seasonal range — and describes
 * it as e.g. "Opens Wednesday 09:00-17:00" or "Opens Wed, Oct 1".
 */
function nextOpenDescriptionFor(hoursDetail: DropoffCenterHoursEntry[] | undefined, categoryKeywords: string[] | undefined, today: Date): string | null {
  const candidates = relevantHoursFor(hoursDetail, categoryKeywords);
  if (candidates.length === 0) return null;
  for (let offset = 0; offset <= 60; offset += 1) {
    const date = new Date(today);
    date.setDate(date.getDate() + offset);
    const matches = candidates.filter((entry) => (
      entry.dayOfWeek === date.getDay()
      && matchesCurrentWeek(entry, date)
      && isWithinSeasonalRange(entry, date)
    ));
    if (matches.length === 0) continue;
    const dayLabel = offset === 0 ? 'today' : (offset === 1 ? 'tomorrow' : date.toLocaleDateString(undefined, { weekday: 'long' }));
    const time = matches[0].openTime && matches[0].closeTime
      ? `${matches[0].openTime.slice(0, 5)}-${matches[0].closeTime.slice(0, 5)}`
      : null;
    return time ? `Opens ${dayLabel} ${time}` : `Opens ${dayLabel}`;
  }
  return null;
}

function CenterCard({ center, categoryKeywords, highlighted, zipMatch }: { center: DropoffCenter; categoryKeywords?: string[]; highlighted?: boolean; zipMatch?: boolean }) {
  // hoursDetail keeps one row per (day, note) combination, e.g. a center that
  // does tire drop-off Mon-Fri and paint drop-off only the 1st Saturday has
  // separate rows for each — so under a specific category we can show just
  // the hours relevant to it instead of every service the center offers.
  const relevantHours = categoryKeywords && categoryKeywords.length > 0 && center.hoursDetail
    ? center.hoursDetail.filter((entry) => matchesKeywords([entry.notes], categoryKeywords))
    : undefined;
  const hoursLines = relevantHours && relevantHours.length > 0
    ? relevantHours.map(formatHoursEntry)
    : (center.hours ? Object.entries(center.hours).map(([day, time]) => `${day}: ${time}`) : []);
  const todaysHours = useMemo(() => todaysHoursFor(center.hoursDetail, categoryKeywords, new Date()), [center.hoursDetail, categoryKeywords]);
  const weeklyOnly = useMemo(() => isWeeklyOnlySchedule(center.hoursDetail, categoryKeywords), [center.hoursDetail, categoryKeywords]);
  const nextOpenLine = useMemo(
    () => (weeklyOnly ? nextOpenDescriptionFor(center.hoursDetail, categoryKeywords, new Date()) : null),
    [weeklyOnly, center.hoursDetail, categoryKeywords],
  );
  const todaysHoursLine = todaysHours.length > 0
    ? `Today: ${todaysHours.map((entry) => (entry.openTime && entry.closeTime ? `${entry.openTime.slice(0, 5)}-${entry.closeTime.slice(0, 5)}` : (entry.notes ?? 'Closed'))).join(', ')}`
    : (weeklyOnly && nextOpenLine ? nextOpenLine : (hoursLines.length > 0 ? 'Closed today' : null));
  return (
    <Accordion
      elevation={0}
      sx={{
        border: zipMatch ? '2px solid' : '1px solid',
        borderColor: zipMatch ? 'primary.main' : (highlighted ? 'success.main' : 'divider'),
        bgcolor: zipMatch ? 'primary.50' : (highlighted ? 'success.50' : 'background.paper'),
        '&:before': { display: 'none' },
      }}
      disableGutters
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%', flexWrap: 'wrap', rowGap: 1 }}>
          <Box sx={{ flexGrow: 1, minWidth: 200 }}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
              <Typography variant="subtitle1" fontWeight={700}>{center.name}</Typography>
              {center.isTemporary && center.eventDate && (
                <Chip
                  icon={<EventIcon fontSize="small" />}
                  label={formatEventDate(new Date(`${center.eventDate}T00:00:00`))}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              )}
              {zipMatch && (
                <Chip icon={<LocationOnIcon fontSize="small" />} label="In your ZIP code" size="small" color="primary" variant="outlined" />
              )}
              {highlighted && (
                <Chip label="Open this week" size="small" color="success" sx={{ fontWeight: 700 }} />
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5}>
              <Typography variant="body2" color="text.secondary">{center.address}</Typography>
              <Chip
                component="a"
                href={getDirectionsUrl({ lat: center.lat, lng: center.lng, address: center.address })}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                clickable
                icon={<DirectionsIcon />}
                label="Directions"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            {(center.phone || hoursLines.length > 0) && (
              <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={0.5} sx={{ mt: 0.5 }}>
                {center.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PhoneIcon fontSize="inherit" color="action" />
                    <Typography variant="caption" color="text.secondary">{center.phone}</Typography>
                  </Box>
                )}
                {todaysHoursLine && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="inherit" color={todaysHours.length > 0 ? 'success' : 'action'} />
                    <Typography variant="caption" color={todaysHours.length > 0 ? 'success.dark' : 'text.secondary'} fontWeight={todaysHours.length > 0 ? 700 : 400}>
                      {todaysHoursLine}
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Box>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack spacing={1.5}>
          {todaysHoursLine && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" color={todaysHours.length > 0 ? 'success' : 'action'} />
              <Typography variant="body2" fontWeight={700} color={todaysHours.length > 0 ? 'success.dark' : 'text.secondary'}>
                {todaysHoursLine}
              </Typography>
            </Box>
          )}
          {center.acceptedMaterials.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">ACCEPTS</Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.5} mt={0.5}>
                {center.acceptedMaterials.map((item) => (
                  <Chip key={item} label={item.replace(/_/g, ' ')} size="small" variant="outlined" />
                ))}
              </Stack>
            </Box>
          )}

          {hoursLines.length > 0 && (
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary">ALL HOURS</Typography>
              <List dense disablePadding>
                {hoursLines.map((line) => (
                  <ListItem key={line} disableGutters sx={{ py: 0.25 }}>
                    <AccessTimeIcon fontSize="small" color="action" sx={{ mr: 1 }} />
                    <ListItemText primary={line} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}

interface UpcomingEvent {
  program: ServerRecyclingProgram;
  location: ServerRecyclingProgram['locations'][number];
  date: Date;
}

/**
 * Flattens each program's dated (one-off event) locations into individual
 * upcoming events, keeping only ones between today and `windowDays` from
 * now, sorted soonest-first. Used for things like the Middlesex County
 * paper shredding schedule, where each location only applies on its own
 * specific day rather than being a standing drop-off site.
 */
function getUpcomingEvents(programs: ServerRecyclingProgram[], windowDays: number): UpcomingEvent[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const windowEnd = new Date(startOfToday);
  windowEnd.setDate(windowEnd.getDate() + windowDays);

  const events: UpcomingEvent[] = [];
  for (const program of programs) {
    for (const location of program.locations) {
      if (!location.event_date) continue;
      const eventDate = new Date(`${location.event_date}T00:00:00`);
      if (eventDate >= startOfToday && eventDate <= windowEnd) {
        events.push({ program, location, date: eventDate });
      }
    }
  }
  events.sort((a, b) => a.date.getTime() - b.date.getTime());
  return events;
}

function formatEventDate(date: Date): string {
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

/**
 * Drop-off centers can themselves be single-day dated events (e.g. an
 * annual bulk-waste collection day) rather than standing sites, tracked via
 * isTemporary/eventDate. Filters out ones whose date has already passed or
 * falls outside the next `windowDays`, leaving standing (non-dated) centers
 * untouched.
 */
function filterUpcomingCenters(centers: DropoffCenter[], windowDays: number): DropoffCenter[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const windowEnd = new Date(startOfToday);
  windowEnd.setDate(windowEnd.getDate() + windowDays);

  return centers.filter((center) => {
    if (!center.isTemporary || !center.eventDate) return true;
    const eventDate = new Date(`${center.eventDate}T00:00:00`);
    return eventDate >= startOfToday && eventDate <= windowEnd;
  });
}

function UpcomingEventCard({ event }: { event: UpcomingEvent }) {
  const { program, location, date } = event;
  const address = [location.address_line1, location.city, location.state, location.postal_code].filter(Boolean).join(', ');
  return (
    <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="flex-start" flexWrap="wrap" rowGap={1}>
        <Chip icon={<EventIcon fontSize="small" />} label={formatEventDate(date)} size="small" color="primary" variant="outlined" />
        <Box sx={{ flexGrow: 1, minWidth: 200 }}>
          <Typography variant="subtitle1" fontWeight={700}>{location.location_name}</Typography>
          {address && (
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" rowGap={0.5} sx={{ mt: 0.25 }}>
              <Typography variant="body2" color="text.secondary">{address}</Typography>
              <Chip
                component="a"
                href={getDirectionsUrl({ lat: location.latitude ?? undefined, lng: location.longitude ?? undefined, address })}
                target="_blank"
                rel="noopener noreferrer"
                clickable
                icon={<DirectionsIcon />}
                label="Directions"
                size="small"
                color="primary"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
          )}
          <Typography variant="caption" color="text.secondary">{program.program_name}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function formatFileSize(bytes: number | null): string | null {
  if (!bytes) return null;
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

const searchableCategories = categoryNavItems.filter((item) => !item.isLocationInfo);

/** Quick-jump search over category names (e.g. "battery", "paint"), with autocomplete suggestions as the user types. Selecting a match navigates to that category's drop-off page. */
function CategorySearch() {
  const navigate = useNavigate();

  const handleSelect = (item: CategoryNavItem | null) => {
    if (!item) return;
    if (item.linkTo) {
      navigate(item.linkTo);
    } else {
      navigate(`/programs?category=${item.key}`);
    }
  };

  return (
    <Autocomplete
      options={searchableCategories}
      getOptionLabel={(item) => item.label}
      onChange={(_, value) => handleSelect(value)}
      isOptionEqualToValue={(a, b) => a.key === b.key}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search for a material or category (e.g. tire, paint, electronics)"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: <SearchIcon fontSize="small" color="action" sx={{ ml: 0.5, mr: 0.5 }} />,
          }}
        />
      )}
      sx={{ maxWidth: 480, width: '100%', mb: 3 }}
    />
  );
}

function LocationInfoPanel() {
  const postalCode = useAppSelector((s) => s.location.postalCode);
  const active = useAppSelector((s) => s.location.active);

  if (!postalCode || !active) {
    return (
      <Alert severity="info">Set your ZIP code from the top bar to see your location details.</Alert>
    );
  }

  return (
    <Box>
      <CategorySearch />
      <Box
        component="img"
        src="/home.png"
        alt="Home"
        sx={{ width: '100%', maxWidth: 960, display: 'block', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      />
    </Box>
  );
}

export function CategoryBrowser() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  const activeCategoryItem = categoryNavItems.find((item) => item.key === activeCategory);
  const [selectedCenterId, setSelectedCenterId] = useState<number | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;
  const { isLoaded: mapsLoaded, loadError: mapsLoadError } = useJsApiLoader({
    googleMapsApiKey: apiKey ?? '',
    id: 'recycle-compass-map',
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const activeJurisdictionId = useAppSelector((s) => s.location.active?.id);
  const userPostalCode = useAppSelector((s) => s.location.postalCode);

  const { data: programs = [], isFetching, isError } = useGetProgramsQuery(
    { jurisdictionId: activeJurisdictionId },
    { skip: !activeCategoryItem || activeCategoryItem.isLocationInfo },
  );

  const centerSearchTerm = activeCategoryItem?.keywords.join(',') ?? '';
  const {
    data: matchingCenters = [],
    isFetching: centersFetching,
  } = useSearchCentersQuery(
    { q: centerSearchTerm, jurisdictionId: activeJurisdictionId },
    { skip: !centerSearchTerm },
  );

  const filtered = useMemo(() => {
    if (!activeCategoryItem || activeCategoryItem.keywords.length === 0) return [];
    return programs.filter((p) => matchesKeywords(
      [p.material_category, p.program_name, p.organization, ...(p.accepts ?? [])],
      activeCategoryItem.keywords,
    ));
  }, [programs, activeCategoryItem]);

  const showingCenters = Boolean(activeCategoryItem && activeCategoryItem.keywords.length > 0);

  const upcomingEvents = useMemo(() => getUpcomingEvents(filtered, 61), [filtered]);

  const eventMapCenters = useMemo<DropoffCenter[]>(() => upcomingEvents
    .filter(({ location }) => location.latitude != null && location.longitude != null)
    .map(({ location }, index) => ({
      id: index,
      name: location.location_name,
      address: [location.address_line1, location.city, location.state, location.postal_code].filter(Boolean).join(', '),
      acceptedMaterials: [],
      lat: location.latitude ?? undefined,
      lng: location.longitude ?? undefined,
      location: location.latitude != null && location.longitude != null ? { lat: location.latitude, lng: location.longitude } : undefined,
    })), [upcomingEvents]);

  // Programs made up entirely of dated one-off events (e.g. the paper
  // shredding schedule) are shown via the dedicated Upcoming Events section
  // above instead of the generic program list, so they aren't duplicated.
  const nonEventPrograms = useMemo(
    () => filtered.filter((p) => !(p.locations.length > 0 && p.locations.every((loc) => loc.event_date))),
    [filtered],
  );

  // Standing (non-dated) program locations that have coordinates get a map
  // alongside the program list, the same way drop-off centers do.
  const programMapCenters = useMemo<DropoffCenter[]>(() => {
    const centers: DropoffCenter[] = [];
    let index = 0;
    for (const program of nonEventPrograms) {
      for (const location of program.locations) {
        if (location.event_date || location.latitude == null || location.longitude == null) continue;
        centers.push({
          id: index++,
          name: location.location_name,
          address: [location.address_line1, location.city, location.state, location.postal_code].filter(Boolean).join(', '),
          acceptedMaterials: [],
          lat: location.latitude,
          lng: location.longitude,
          location: { lat: location.latitude, lng: location.longitude },
        });
      }
    }
    return centers;
  }, [nonEventPrograms]);

  const upcomingCenters = useMemo(() => filterUpcomingCenters(matchingCenters, 61), [matchingCenters]);

  const sortedCenters = useMemo(() => {
    const today = new Date();
    const withFlags = upcomingCenters.map((center) => {
      const isCurrent = isCenterActiveThisWeek(center.hoursDetail, activeCategoryItem?.keywords, today);
      const weekRestricted = isWeekRestricted(center.hoursDetail, activeCategoryItem?.keywords);
      const zipMatch = Boolean(userPostalCode && center.zip === userPostalCode);
      return { center, isCurrent, highlighted: isCurrent && weekRestricted, zipMatch };
    });
    withFlags.sort((a, b) => {
      if (a.zipMatch !== b.zipMatch) return Number(b.zipMatch) - Number(a.zipMatch);
      const aDate = a.center.isTemporary && a.center.eventDate ? a.center.eventDate : null;
      const bDate = b.center.isTemporary && b.center.eventDate ? b.center.eventDate : null;
      if (aDate && bDate) return aDate.localeCompare(bDate);
      if (aDate !== bDate) return aDate ? -1 : 1;
      return Number(b.isCurrent) - Number(a.isCurrent);
    });
    return withFlags;
  }, [upcomingCenters, activeCategoryItem, userPostalCode]);

  const { data: categoryDocuments = [] } = useGetSourceDocumentsQuery(
    activeCategoryItem && !activeCategoryItem.isLocationInfo && activeJurisdictionId
      ? { jurisdictionId: activeJurisdictionId, categoryKey: activeCategoryItem.key }
      : undefined,
    { skip: !activeCategoryItem || activeCategoryItem.isLocationInfo || !activeJurisdictionId },
  );
  const categoryImage = categoryDocuments.find((doc) => doc.document_type === 'IMAGE');

  if (!activeCategoryItem) {
    return (
      <Alert severity="info">Choose a category from the left to see drop-off locations and programs.</Alert>
    );
  }

  if (activeCategoryItem.isLocationInfo) {
    return <LocationInfoPanel />;
  }

  const hasDatedEvents = !isFetching && upcomingEvents.length > 0;

  return (
    <Box>
      {showingCenters && hasDatedEvents && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>Events</Typography>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {upcomingEvents.length} event{upcomingEvents.length === 1 ? '' : 's'} in the next two months, soonest first
          </Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
            <Stack spacing={1.5} sx={{ width: { xs: '100%', md: '40%' } }}>
              {upcomingEvents.map(({ program, location, date }) => (
                <UpcomingEventCard key={`${program.id}-${location.location_name}-${date.toISOString()}`} event={{ program, location, date }} />
              ))}
            </Stack>
            <Box sx={{ width: { xs: '100%', md: '60%' }, height: 480, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <DropoffMap
                centers={eventMapCenters}
                userCoords={null}
                onCenterSelect={() => {}}
                selectedId={null}
                isLoaded={mapsLoaded}
                loadError={mapsLoadError}
              />
            </Box>
          </Stack>
          {categoryImage && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{categoryImage.title}</Typography>
              <Box
                component="a"
                href={`${apiOrigin}${categoryImage.download_url}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', maxWidth: 720 }}
              >
                <Box
                  component="img"
                  src={`${apiOrigin}${categoryImage.download_url}`}
                  alt={categoryImage.title}
                  sx={{ width: '100%', display: 'block' }}
                />
              </Box>
            </Box>
          )}
          <Divider sx={{ mt: 3 }} />
        </Box>
      )}

      {showingCenters && !hasDatedEvents && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Drop-off Locations</Typography>
          {centersFetching && (
            <Box display="flex" justifyContent="center" py={3}><CircularProgress size={28} /></Box>
          )}
          {!centersFetching && upcomingCenters.length === 0 && (
            <Alert severity="info">No drop-off locations found for this category yet.</Alert>
          )}
          {!centersFetching && upcomingCenters.length > 0 && (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
              <Stack spacing={1.5} sx={{ width: { xs: '100%', md: '40%' } }}>
                {sortedCenters.map(({ center, highlighted, zipMatch }) => (
                  <CenterCard key={center.id} center={center} categoryKeywords={activeCategoryItem.keywords} highlighted={highlighted} zipMatch={zipMatch} />
                ))}
              </Stack>
              <Box sx={{ width: { xs: '100%', md: '60%' }, height: 480, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <DropoffMap
                  centers={upcomingCenters}
                  userCoords={null}
                  onCenterSelect={setSelectedCenterId}
                  selectedId={selectedCenterId}
                  isLoaded={mapsLoaded}
                  loadError={mapsLoadError}
                />
              </Box>
            </Stack>
          )}
          {categoryImage && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>{categoryImage.title}</Typography>
              <Box
                component="a"
                href={`${apiOrigin}${categoryImage.download_url}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden', maxWidth: 720 }}
              >
                <Box
                  component="img"
                  src={`${apiOrigin}${categoryImage.download_url}`}
                  alt={categoryImage.title}
                  sx={{ width: '100%', display: 'block' }}
                />
              </Box>
            </Box>
          )}
          <Divider sx={{ mt: 3 }} />
        </Box>
      )}

      {isFetching && (
        <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>Could not load recycling programs. Please try again later.</Alert>
      )}

      {!activeCategoryItem.hidePrograms && !isFetching && !isError && filtered.length === 0 && showingCenters && upcomingCenters.length === 0 && (
        <Alert severity="info" sx={{ mt: -2 }}>No mail-in or retail programs found for this category either.</Alert>
      )}

      {!activeCategoryItem.hidePrograms && !isFetching && !isError && filtered.length === 0 && !showingCenters && (
        <Alert severity="info">No programs found for this category.</Alert>
      )}

      {activeCategoryItem.externalLink && (
        <Box sx={{ mb: 4, p: 2.5, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary">
            For more information and drop-off locations, visit{' '}
            <MuiLink href={activeCategoryItem.externalLink.url} target="_blank" rel="noopener noreferrer" fontWeight={600}>
              {activeCategoryItem.externalLink.label}
            </MuiLink>
            .
          </Typography>
        </Box>
      )}

      {!activeCategoryItem.hidePrograms && !isFetching && !isError && nonEventPrograms.length > 0 && (
        <>
          {showingCenters && <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Programs</Typography>}
          <Typography variant="body2" color="text.secondary" mb={2}>
            {nonEventPrograms.length} program{nonEventPrograms.length === 1 ? '' : 's'}
          </Typography>
          {programMapCenters.length > 0 ? (
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
              <Stack spacing={1.5} sx={{ width: { xs: '100%', md: '40%' } }}>
                {nonEventPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </Stack>
              <Box sx={{ width: { xs: '100%', md: '60%' }, height: 480, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                <DropoffMap
                  centers={programMapCenters}
                  userCoords={null}
                  onCenterSelect={() => {}}
                  selectedId={null}
                  isLoaded={mapsLoaded}
                  loadError={mapsLoadError}
                />
              </Box>
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              {nonEventPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
