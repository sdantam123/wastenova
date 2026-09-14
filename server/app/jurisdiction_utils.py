from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Jurisdiction


async def ancestor_jurisdiction_ids(db: AsyncSession, jurisdiction_id: str) -> list[str]:
    """Walk parent_id up from jurisdiction_id, returning it plus all ancestors.

    Lets a resident see county- or state-run programs/centers even when
    those are registered against a broader jurisdiction than their exact
    township (e.g. a county HHW program open to all residents regardless
    of which township hosts it).
    """
    ids = [jurisdiction_id]
    current_id: str | None = jurisdiction_id
    while current_id:
        result = await db.execute(select(Jurisdiction.parent_id).where(Jurisdiction.id == current_id))
        parent_id = result.scalar_one_or_none()
        if not parent_id or parent_id in ids:
            break
        ids.append(parent_id)
        current_id = parent_id
    return ids
