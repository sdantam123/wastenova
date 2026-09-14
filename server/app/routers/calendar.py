from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import PickupSchedule, ScheduleException
from app.schemas import CalendarEventOut, CalendarResponse, HolidayDelayOut, PickupScheduleOut, ScheduleExceptionOut

router = APIRouter(prefix="/calendar", tags=["calendar"])


def _python_weekday_from_db(day_of_week: int) -> int:
    """Convert DB weekday (0=Sunday ... 6=Saturday) to Python weekday (0=Monday ... 6=Sunday)."""
    return (day_of_week + 6) % 7


def _expand_schedule(schedule: PickupSchedule, from_date: date, to_date: date) -> list[CalendarEventOut]:
    events: list[CalendarEventOut] = []
    current = max(schedule.effective_from, from_date)
    end_date = min(schedule.effective_to or to_date, to_date)

    if schedule.day_of_week is None:
        return events

    target_weekday = _python_weekday_from_db(schedule.day_of_week)
    while current.weekday() != target_weekday:
        current += timedelta(days=1)

    while current <= end_date:
        if schedule.frequency == "WEEKLY":
            step_days = 7
        elif schedule.frequency == "BIWEEKLY":
            step_days = 14
        else:
            step_days = 28

        if schedule.week_of_month is None or ((current.day - 1) // 7) + 1 == schedule.week_of_month:
            events.append(
                CalendarEventOut(
                    date=current,
                    type=schedule.schedule_type,
                    materials=schedule.accepted_materials or [],
                    notes=schedule.preparation_notes,
                )
            )
        current += timedelta(days=step_days)

    return events


@router.get("/{jurisdiction_id}/templates", response_model=list[PickupScheduleOut])
async def get_schedule_templates(
    jurisdiction_id: str,
    from_date: date | None = None,
    to_date: date | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[PickupSchedule]:
    query = select(PickupSchedule).where(PickupSchedule.jurisdiction_id == jurisdiction_id)
    if from_date:
        query = query.where(
            (PickupSchedule.effective_to.is_(None)) | (PickupSchedule.effective_to >= from_date)
        )
    if to_date:
        query = query.where(PickupSchedule.effective_from <= to_date)
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("/{jurisdiction_id}", response_model=CalendarResponse)
async def get_schedule(
    jurisdiction_id: str,
    from_date: date | None = None,
    to_date: date | None = None,
    db: AsyncSession = Depends(get_db),
) -> CalendarResponse:
    start = from_date or date.today()
    end = to_date or (start + timedelta(days=84))

    schedules_result = await db.execute(
        select(PickupSchedule).where(PickupSchedule.jurisdiction_id == jurisdiction_id)
    )
    schedules = list(schedules_result.scalars().all())

    exceptions_result = await db.execute(
        select(ScheduleException).where(
            ScheduleException.jurisdiction_id == jurisdiction_id,
            ScheduleException.exception_date >= start,
            ScheduleException.exception_date <= end,
        )
    )
    exceptions = list(exceptions_result.scalars().all())

    events: list[CalendarEventOut] = []
    for schedule in schedules:
        events.extend(_expand_schedule(schedule, start, end))

    holiday_delays: list[HolidayDelayOut] = []
    for exception in exceptions:
        for index, event in enumerate(events):
            if event.date == exception.exception_date:
                if exception.cancelled:
                    events.pop(index)
                elif exception.new_date:
                    event.date = exception.new_date
                    if exception.reason:
                        event.notes = exception.reason if not event.notes else f"{event.notes} {exception.reason}"
                break

        impact = "Collection cancelled"
        if exception.new_date:
            impact = f"Collection moved to {exception.new_date.isoformat()}"
        holiday_delays.append(
            HolidayDelayOut(
                holiday=exception.reason,
                date=exception.exception_date,
                impact=impact,
            )
        )

    events.sort(key=lambda event: (event.date, event.type))
    return CalendarResponse(jurisdiction_id=jurisdiction_id, schedule=events, holiday_delays=holiday_delays)


@router.get("/{jurisdiction_id}/exceptions", response_model=list[ScheduleExceptionOut])
async def get_schedule_exceptions(
    jurisdiction_id: str, db: AsyncSession = Depends(get_db)
) -> list[ScheduleException]:
    result = await db.execute(
        select(ScheduleException).where(ScheduleException.jurisdiction_id == jurisdiction_id)
    )
    return list(result.scalars().all())
