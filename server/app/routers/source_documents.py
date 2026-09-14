from pathlib import PurePosixPath

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.jurisdiction_utils import ancestor_jurisdiction_ids
from app.models import SourceDocument
from app.schemas import SourceDocumentOut

router = APIRouter(prefix="/source-documents", tags=["source-documents"])


def _to_out(doc: SourceDocument) -> SourceDocumentOut:
    filename = PurePosixPath(doc.file_path).name
    return SourceDocumentOut(
        id=doc.id,
        title=doc.title,
        download_url=f"/static/source-documents/{filename}",
        document_type=doc.document_type,
        category_key=doc.category_key,
        source_url=doc.source_url,
        jurisdiction_id=doc.jurisdiction_id,
        publication_year=doc.publication_year,
        file_size_bytes=doc.file_size_bytes,
        notes=doc.notes,
    )


@router.get("", response_model=list[SourceDocumentOut])
async def list_source_documents(
    jurisdiction_id: str | None = Query(None, alias="jurisdictionId"),
    category_key: str | None = Query(None, alias="categoryKey"),
    db: AsyncSession = Depends(get_db),
) -> list[SourceDocumentOut]:
    query = select(SourceDocument).order_by(SourceDocument.title)
    if jurisdiction_id:
        jurisdiction_ids = await ancestor_jurisdiction_ids(db, jurisdiction_id)
        query = query.where(SourceDocument.jurisdiction_id.in_(jurisdiction_ids))

    if category_key:
        query = query.where(SourceDocument.category_key == category_key)
    else:
        query = query.where(SourceDocument.category_key.is_(None))

    result = await db.execute(query)
    return [_to_out(doc) for doc in result.scalars().all()]
