from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Jurisdiction, RecyclingRule
from app.schemas import LookupResultOut

router = APIRouter(tags=["lookup"])


def _display_name(jurisdiction: Jurisdiction) -> str:
    parts = [jurisdiction.township, jurisdiction.county, jurisdiction.state, jurisdiction.country]
    return ", ".join(part for part in parts if part)


@router.get("/lookup", response_model=list[LookupResultOut])
async def lookup_item(
    item: str = Query(..., min_length=1),
    jurisdiction_id: str = Query(..., alias="jurisdictionId"),
    db: AsyncSession = Depends(get_db),
) -> list[LookupResultOut]:
    jurisdiction_result = await db.execute(select(Jurisdiction).where(Jurisdiction.id == jurisdiction_id))
    jurisdiction = jurisdiction_result.scalar_one_or_none()
    if jurisdiction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jurisdiction not found")

    search = f"%{item.strip()}%"
    result = await db.execute(
        select(RecyclingRule)
        .where(RecyclingRule.jurisdiction_id == jurisdiction_id)
        .where(
            or_(
                RecyclingRule.material_name.ilike(search),
                RecyclingRule.material_code.ilike(search),
                RecyclingRule.special_notes.ilike(search),
            )
        )
        .order_by(RecyclingRule.is_accepted.desc(), RecyclingRule.material_name.asc())
    )
    rules = list(result.scalars().all())
    if not rules:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No matching recycling guidance found")

    jurisdiction_name = _display_name(jurisdiction)
    return [
        LookupResultOut(
            id=rule.id,
            item_name=rule.material_name,
            material_code=rule.material_code,
            recyclable=rule.is_accepted,
            category=rule.category,
            preparation_steps=rule.preparation_steps or [],
            notes=rule.special_notes or rule.rejection_reason or "No additional guidance available.",
            jurisdiction_id=rule.jurisdiction_id,
            jurisdiction_name=jurisdiction_name,
        )
        for rule in rules
    ]