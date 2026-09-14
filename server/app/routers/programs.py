from fastapi import APIRouter, Depends, Query
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.jurisdiction_utils import ancestor_jurisdiction_ids
from app.models import RecyclingProgram
from app.schemas import RecyclingProgramOut

router = APIRouter(prefix="/programs", tags=["programs"])


@router.get("", response_model=list[RecyclingProgramOut])
async def list_programs(
    material_category: str | None = Query(None, alias="materialCategory"),
    program_type: str | None = Query(None, alias="programType"),
    jurisdiction_id: str | None = Query(None, alias="jurisdictionId"),
    db: AsyncSession = Depends(get_db),
) -> list[RecyclingProgram]:
    query = (
        select(RecyclingProgram)
        .where(RecyclingProgram.is_active.is_(True))
        .options(selectinload(RecyclingProgram.locations))
        .order_by(RecyclingProgram.material_category, RecyclingProgram.program_name)
    )
    if material_category:
        query = query.where(RecyclingProgram.material_category.ilike(material_category))
    if program_type:
        query = query.where(RecyclingProgram.program_type == program_type)
    if jurisdiction_id:
        # Programs with no jurisdiction (mail-in / national retail take-back
        # programs) apply everywhere. Programs tied to a jurisdiction only
        # show for that jurisdiction or its ancestors (e.g. a county-run
        # program shows for every township in that county), never for an
        # unrelated county/jurisdiction.
        jurisdiction_ids = await ancestor_jurisdiction_ids(db, jurisdiction_id)
        query = query.where(
            or_(
                RecyclingProgram.jurisdiction_id.is_(None),
                RecyclingProgram.jurisdiction_id.in_(jurisdiction_ids),
            )
        )

    result = await db.execute(query)
    return list(result.scalars().all())
