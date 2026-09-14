from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.jurisdiction_utils import ancestor_jurisdiction_ids
from app.models import CenterHours, DropoffCenter
from app.schemas import DropoffCenterCreate, DropoffCenterOut, DropoffCenterUpdate

router = APIRouter(prefix="/centers", tags=["centers"])

METERS_PER_MILE = 1609.344


@router.get("", response_model=list[DropoffCenterOut])
async def list_centers(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(25, gt=0, description="Search radius in miles"),
    material: str | None = None,
    category: str | None = None,
    jurisdiction_id: str | None = Query(None, alias="jurisdictionId"),
    limit: int = Query(20, gt=0, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[DropoffCenterOut]:
    distance_meters = func.ST_DistanceSphere(
        func.ST_MakePoint(DropoffCenter.longitude, DropoffCenter.latitude),
        func.ST_MakePoint(lng, lat),
    )

    query = (
        select(DropoffCenter, distance_meters.label("distance_meters"))
        .where(DropoffCenter.is_active.is_(True))
        .options(selectinload(DropoffCenter.hours))
    )
    if material:
        query = query.where(DropoffCenter.accepted_materials.any(material))
    if category:
        query = query.where(DropoffCenter.center_type == category)

    if jurisdiction_id:
        jurisdiction_ids = await ancestor_jurisdiction_ids(db, jurisdiction_id)
        query = query.where(
            (distance_meters <= radius * METERS_PER_MILE)
            | (DropoffCenter.jurisdiction_id.in_(jurisdiction_ids))
        )
    else:
        query = query.where(distance_meters <= radius * METERS_PER_MILE)

    query = query.order_by(distance_meters).limit(limit)

    result = await db.execute(query)
    centers_out: list[DropoffCenterOut] = []
    for center, distance_m in result.all():
        out = DropoffCenterOut.model_validate(center)
        out.distance_miles = round(distance_m / METERS_PER_MILE, 2)
        centers_out.append(out)
    return centers_out


@router.get("/admin", response_model=list[DropoffCenterOut])
async def list_all_centers_for_admin(db: AsyncSession = Depends(get_db)) -> list[DropoffCenter]:
    result = await db.execute(select(DropoffCenter).options(selectinload(DropoffCenter.hours)).order_by(DropoffCenter.name))
    return list(result.scalars().all())


@router.get("/search", response_model=list[DropoffCenterOut])
async def search_centers(
    q: str = Query(..., min_length=1, description="Comma-separated keywords to match against accepted materials and hours notes (OR'd together)"),
    jurisdiction_id: str | None = Query(None, alias="jurisdictionId"),
    limit: int = Query(50, gt=0, le=200),
    db: AsyncSession = Depends(get_db),
) -> list[DropoffCenter]:
    """Keyword search across centers without requiring a lat/lng radius.

    accepted_materials values are inconsistently cased/formatted in the
    data (e.g. "Paint" vs "PAINT"), and some categories like cooking oil
    are only described in center_hours.notes rather than tagged as a
    material at all, so this matches case-insensitively against both.
    Multiple comma-separated terms are OR'd (e.g. "battery,batteries").
    """
    terms = [term.strip().lower() for term in q.split(",") if term.strip()]
    if not terms:
        return []

    term_filters = []
    for term in terms:
        pattern = f"%{term}%"
        term_filters.append(func.array_to_string(DropoffCenter.accepted_materials, ',').ilike(pattern))
        term_filters.append(DropoffCenter.hours.any(CenterHours.notes.ilike(pattern)))

    query = (
        select(DropoffCenter)
        .where(DropoffCenter.is_active.is_(True))
        .where(or_(*term_filters))
        .options(selectinload(DropoffCenter.hours))
        .order_by(DropoffCenter.name)
        .limit(limit)
    )
    if jurisdiction_id:
        jurisdiction_ids = await ancestor_jurisdiction_ids(db, jurisdiction_id)
        query = query.where(DropoffCenter.jurisdiction_id.in_(jurisdiction_ids))

    result = await db.execute(query)
    return list(result.scalars().all())


@router.post("", response_model=DropoffCenterOut, status_code=status.HTTP_201_CREATED)
async def create_center(payload: DropoffCenterCreate, db: AsyncSession = Depends(get_db)) -> DropoffCenter:
    center = DropoffCenter(**payload.model_dump())
    db.add(center)
    await db.commit()
    await db.refresh(center)
    query = select(DropoffCenter).where(DropoffCenter.id == center.id).options(selectinload(DropoffCenter.hours))
    result = await db.execute(query)
    return result.scalar_one()


@router.get("/{center_id}", response_model=DropoffCenterOut)
async def get_center(center_id: int, db: AsyncSession = Depends(get_db)) -> DropoffCenter:
    query = (
        select(DropoffCenter)
        .where(DropoffCenter.id == center_id)
        .options(selectinload(DropoffCenter.hours))
    )
    result = await db.execute(query)
    center = result.scalar_one_or_none()
    if center is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Center not found")
    return center


@router.put("/{center_id}", response_model=DropoffCenterOut)
async def update_center(center_id: int, payload: DropoffCenterUpdate, db: AsyncSession = Depends(get_db)) -> DropoffCenter:
    result = await db.execute(
        select(DropoffCenter).where(DropoffCenter.id == center_id).options(selectinload(DropoffCenter.hours))
    )
    center = result.scalar_one_or_none()
    if center is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Center not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(center, field, value)

    await db.commit()
    await db.refresh(center)
    query = select(DropoffCenter).where(DropoffCenter.id == center.id).options(selectinload(DropoffCenter.hours))
    result = await db.execute(query)
    return result.scalar_one()


@router.delete("/{center_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_center(center_id: int, db: AsyncSession = Depends(get_db)) -> Response:
    result = await db.execute(select(DropoffCenter).where(DropoffCenter.id == center_id))
    center = result.scalar_one_or_none()
    if center is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Center not found")

    await db.delete(center)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
