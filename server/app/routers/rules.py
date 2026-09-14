from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import RecyclingRule
from app.schemas import RecyclingRuleOut

router = APIRouter(prefix="/rules", tags=["rules"])


@router.get("/{jurisdiction_id}", response_model=list[RecyclingRuleOut])
async def get_rules_for_jurisdiction(
    jurisdiction_id: str, db: AsyncSession = Depends(get_db)
) -> list[RecyclingRule]:
    result = await db.execute(
        select(RecyclingRule).where(RecyclingRule.jurisdiction_id == jurisdiction_id)
    )
    rules = list(result.scalars().all())
    if not rules:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No rules found for this jurisdiction")
    return rules


@router.get("/{jurisdiction_id}/material/{material_code}", response_model=RecyclingRuleOut)
async def get_rule_for_material(
    jurisdiction_id: str, material_code: str, db: AsyncSession = Depends(get_db)
) -> RecyclingRule:
    result = await db.execute(
        select(RecyclingRule).where(
            RecyclingRule.jurisdiction_id == jurisdiction_id,
            RecyclingRule.material_code == material_code,
        )
    )
    rule = result.scalar_one_or_none()
    if rule is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rule not found")
    return rule
