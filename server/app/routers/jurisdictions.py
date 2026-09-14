from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Jurisdiction
from app.schemas import JurisdictionOut

router = APIRouter(prefix="/jurisdictions", tags=["jurisdictions"])


@router.get("", response_model=list[JurisdictionOut])
async def list_jurisdictions(
    country_code: str | None = None,
    state_code: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[Jurisdiction]:
    query = select(Jurisdiction)
    if country_code:
        query = query.where(Jurisdiction.country_code == country_code.upper())
    if state_code:
        query = query.where(Jurisdiction.state_code == state_code.upper())
    result = await db.execute(query)
    return list(result.scalars().all())


@router.get("/{jurisdiction_id}", response_model=JurisdictionOut)
async def get_jurisdiction(jurisdiction_id: str, db: AsyncSession = Depends(get_db)) -> Jurisdiction:
    result = await db.execute(select(Jurisdiction).where(Jurisdiction.id == jurisdiction_id))
    jurisdiction = result.scalar_one_or_none()
    if jurisdiction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jurisdiction not found")
    return jurisdiction
