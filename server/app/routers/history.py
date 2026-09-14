import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_user
from app.models import ScanHistory, User
from app.schemas import ImpactSummary, ScanHistoryCreate, ScanHistoryOut

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[ScanHistoryOut])
async def get_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ScanHistory]:
    result = await db.execute(
        select(ScanHistory)
        .where(ScanHistory.user_id == current_user.id)
        .order_by(ScanHistory.scanned_at.desc())
    )
    return list(result.scalars().all())


@router.post("", response_model=ScanHistoryOut, status_code=status.HTTP_201_CREATED)
async def create_history_entry(
    payload: ScanHistoryCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ScanHistory:
    if payload.recyclable_count > payload.items_count:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="recyclable_count cannot exceed items_count",
        )

    entry = ScanHistory(
        id=uuid.uuid4(),
        user_id=current_user.id,
        jurisdiction_id=payload.jurisdiction_id,
        image_key=payload.image_key,
        objects=payload.objects,
        items_count=payload.items_count,
        recyclable_count=payload.recyclable_count,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


@router.get("/impact", response_model=ImpactSummary)
async def get_impact(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ImpactSummary:
    result = await db.execute(
        select(
            func.coalesce(func.sum(ScanHistory.items_count), 0),
            func.coalesce(func.sum(ScanHistory.recyclable_count), 0),
        ).where(ScanHistory.user_id == current_user.id)
    )
    total_items, total_recyclable = result.one()
    return ImpactSummary(
        user_id=current_user.id,
        total_items_scanned=total_items,
        items_correctly_recycled=total_recyclable,
    )
