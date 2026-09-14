from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import re

from app.database import get_db
from app.models import Jurisdiction
from app.schemas import LocationResolveResponse

router = APIRouter(prefix="/location", tags=["location"])


def _to_location_response(jurisdiction: Jurisdiction, postal_code: str | None = None) -> LocationResolveResponse:
    return LocationResolveResponse(
        country=jurisdiction.country,
        country_code=jurisdiction.country_code,
        state=jurisdiction.state,
        state_code=jurisdiction.state_code,
        county=jurisdiction.county,
        township=jurisdiction.township,
        postal_code=postal_code,
        jurisdiction_id=jurisdiction.id,
    )


@router.get("/resolve-by-postal", response_model=LocationResolveResponse)
async def resolve_by_postal(
    postal_code: str = Query(..., alias="postalCode"),
    country_code: str | None = Query(None, alias="countryCode"),
    db: AsyncSession = Depends(get_db),
) -> LocationResolveResponse:
    normalized_postal = postal_code.strip()
    normalized_country = country_code.upper() if country_code else None

    # Accept common US ZIP formats such as 08536-1234 and normalize to 5 digits.
    if normalized_country in (None, "US"):
        match = re.search(r"\b(\d{5})\b", normalized_postal)
        if match:
            normalized_postal = match.group(1)

    query = select(Jurisdiction).where(Jurisdiction.postal_codes.any(normalized_postal))
    if normalized_country:
        query = query.where(Jurisdiction.country_code == normalized_country)

    result = await db.execute(query)
    jurisdictions = list(result.scalars().all())
    if not jurisdictions:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Jurisdiction not found for postal code")

    jurisdiction = max(jurisdictions, key=lambda item: sum(bool(value) for value in (item.state, item.county, item.township)))
    return _to_location_response(jurisdiction, postal_code=normalized_postal)