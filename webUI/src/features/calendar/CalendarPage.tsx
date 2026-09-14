import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent,
  Stack, Alert, Grid, Paper,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RecyclingIcon from '@mui/icons-material/Recycling';
import GrassIcon from '@mui/icons-material/Grass';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useLazyGetPickupScheduleQuery, useLazyResolveByPostalQuery, useGetSourceDocumentsQuery, apiOrigin } from '../../api/recycleApi';
import { useAppSelector } from '../../store/store';
import {
  format, addDays, addMonths, startOfMonth, endOfMonth, eachDayOfInterval,
  getDay, isSameDay, isToday, isBefore,
} from 'date-fns';

interface PickupEvent {
  date: Date;
  type: 'RECYCLING' | 'TRASH' | 'COMPOST' | 'BULK';
  label: string;
}

const typeConfig = {
  RECYCLING: { color: '#334155', bgcolor: '#FFFFFF', icon: <RecyclingIcon fontSize="small" />, label: 'Recycling' },
  TRASH:     { color: '#334155', bgcolor: '#FFFFFF', icon: <DeleteOutlineIcon fontSize="small" />, label: 'Trash' },
  COMPOST:   { color: '#334155', bgcolor: '#FFFFFF', icon: <GrassIcon fontSize="small" />, label: 'Compost' },
  BULK:      { color: '#334155', bgcolor: '#FFFFFF', icon: <LocalShippingIcon fontSize="small" />, label: 'Bulk Pickup' },
};

function MiniCalendar({ events, month }: { events: PickupEvent[]; month: Date }) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  const startWeekday = getDay(start); // 0=Sun

  const eventsByDay = new Map<string, PickupEvent[]>();
  events.forEach((ev) => {
    const k = format(ev.date, 'yyyy-MM-dd');
    if (!eventsByDay.has(k)) eventsByDay.set(k, []);
    eventsByDay.get(k)!.push(ev);
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card elevation={2} sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} mb={2} textAlign="center">
          {format(month, 'MMMM yyyy')}
        </Typography>
        <Grid container columns={7} sx={{ textAlign: 'center' }}>
          {weekDays.map((d) => (
            <Grid item xs={1} key={d}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>{d}</Typography>
            </Grid>
          ))}
          {/* Empty cells before month start */}
          {Array.from({ length: startWeekday }).map((_, i) => (
            <Grid item xs={1} key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const k = format(day, 'yyyy-MM-dd');
            const dayEvents = eventsByDay.get(k) ?? [];
            const past = isBefore(day, addDays(new Date(), -1));
            return (
              <Grid item xs={1} key={k}>
                <Box
                  sx={{
                    py: 0.5, px: 0.2, m: 0.3, borderRadius: 1,
                    bgcolor: isToday(day) ? 'primary.main' : 'transparent',
                    opacity: past ? 0.5 : 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', color: isToday(day) ? 'white' : 'text.primary', fontWeight: isToday(day) ? 700 : 400 }}
                  >
                    {format(day, 'd')}
                  </Typography>
                  <Box display="flex" justifyContent="center" flexWrap="wrap" gap={0.2}>
                    {dayEvents.map((ev) => (
                      <Box
                        key={ev.type}
                        sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: typeConfig[ev.type].color }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
}

export function CalendarPage() {
  const [events, setEvents] = useState<PickupEvent[]>([]);
  const [lookupError, setLookupError] = useState('');
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const savedPostalCode = useAppSelector((state) => state.location.postalCode);
  const activeJurisdictionId = useAppSelector((state) => state.location.active?.id);
  const [resolveByPostal, { isFetching: resolvingPostal }] = useLazyResolveByPostalQuery();
  const [getPickupSchedule, { isFetching: loadingSchedule }] = useLazyGetPickupScheduleQuery();
  const { data: curbsideDocs = [] } = useGetSourceDocumentsQuery(
    activeJurisdictionId ? { jurisdictionId: activeJurisdictionId, categoryKey: 'curbside' } : undefined,
    { skip: !activeJurisdictionId },
  );
  const curbsideImage = curbsideDocs.find((doc) => doc.document_type === 'IMAGE');

  useEffect(() => {
    if (!savedPostalCode) {
      setEvents([]);
      return;
    }

    let cancelled = false;

    const loadSchedule = async () => {
      setLookupError('');
      try {
        const resolved = await resolveByPostal({ postalCode: savedPostalCode, countryCode: 'US' }).unwrap();
        const schedule = await getPickupSchedule({
          jurisdictionId: resolved.jurisdiction_id,
          from: format(today, 'yyyy-MM-dd'),
          to: format(addDays(today, 84), 'yyyy-MM-dd'),
        }).unwrap();

        if (cancelled) return;
        setEvents(schedule.map((event) => ({
          date: new Date(`${event.date}T00:00:00`),
          type: event.type === 'GENERAL' ? 'TRASH' : event.type === 'YARD_WASTE' ? 'COMPOST' : (event.type as PickupEvent['type']),
          label: event.label,
        })));
      } catch (error: unknown) {
        if (cancelled) return;
        setEvents([]);
        const status = typeof error === 'object' && error !== null && 'status' in error
          ? (error as { status?: number | string }).status
          : undefined;
        if (status === 404) {
          setLookupError('This ZIP code is not available in our database yet.');
        } else {
          setLookupError('We could not load a schedule for that ZIP code. Please try again.');
        }
      }
    };

    void loadSchedule();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedPostalCode]);

  const loading = resolvingPostal || loadingSchedule;

  const upcoming = events.filter((e) => !isBefore(e.date, addDays(today, -1))).slice(0, 20);
  const nextPickups = upcoming.slice(0, 3);
  const month0 = addMonths(today, monthOffset);

  return (
    <Box>
      <Box sx={{ px: 3, py: 3 }}>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          {/* Left column: schedule, upcoming pickups */}
          <Box sx={{ flex: '0 1 25%', minWidth: 280 }}>
            {events.length === 0 && !loading && (
              <Alert severity="info" icon={<CalendarMonthIcon />}>
                {lookupError || 'Set your ZIP code from the top bar to see your personalised pickup schedule.'}
              </Alert>
            )}

            {events.length > 0 && (
              <>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={700}>Schedule</Typography>
                </Box>

                <Box sx={{ maxWidth: 480, position: 'relative' }}>
                  <MiniCalendar events={events} month={month0} />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setMonthOffset((offset) => offset - 1)}
                    aria-label="Previous month"
                    sx={{
                      position: 'absolute',
                      left: -12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 0,
                      width: 32,
                      height: 32,
                      minHeight: 32,
                      px: 0,
                      borderRadius: 999,
                      p: 0,
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setMonthOffset((offset) => offset + 1)}
                    aria-label="Next month"
                    sx={{
                      position: 'absolute',
                      right: -12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      minWidth: 0,
                      width: 32,
                      height: 32,
                      minHeight: 32,
                      px: 0,
                      borderRadius: 999,
                      p: 0,
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </Button>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    Upcoming Pickups
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                    {nextPickups.map((ev, i) => {
                      const cfg = typeConfig[ev.type];
                      return (
                        <Paper
                          key={i}
                          elevation={0}
                          sx={{
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 1,
                            width: 'fit-content',
                          }}
                        >
                          <Box sx={{ color: cfg.color, display: 'flex', alignItems: 'center' }}>{cfg.icon}</Box>
                          <Typography variant="body2" fontWeight={700}>{format(ev.date, 'EEE, MMM d')}</Typography>
                        </Paper>
                      );
                    })}
                  </Stack>
                </Box>

                <Alert severity="warning" sx={{ mt: 3 }}>
                  <strong>Holiday notice:</strong> If your pickup falls on a federal holiday, service typically shifts to the next business day.
                  Check your municipality's website for holiday schedule updates.
                </Alert>
              </>
            )}
          </Box>

          {/* Right column: what goes in your recycling bin */}
          {curbsideImage && (
            <Box sx={{ flex: '1 1 75%', minWidth: 0 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                What Goes in Your Recycling Bin
              </Typography>
              <Box
                component="a"
                href={`${apiOrigin}${curbsideImage.download_url}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: 'block', border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}
              >
                <Box
                  component="img"
                  src={`${apiOrigin}${curbsideImage.download_url}`}
                  alt={curbsideImage.title}
                  sx={{ width: '100%', display: 'block' }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
