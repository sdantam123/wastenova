from collections.abc import AsyncGenerator
from pathlib import Path

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import settings

engine = create_async_engine(settings.database_url, echo=False, pool_pre_ping=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields a database session per request."""
    async with AsyncSessionLocal() as session:
        yield session


def load_sql_statements(sql_path: str | Path) -> list[str]:
    """Load and split a SQL file into executable statements."""
    path = Path(sql_path)
    raw_sql = path.read_text(encoding="utf-8")

    cleaned_lines: list[str] = []
    for line in raw_sql.splitlines():
        if "--" in line:
            line = line.split("--", 1)[0]
        cleaned_lines.append(line)

    sql_text = "\n".join(cleaned_lines)
    statements: list[str] = []
    for statement in sql_text.split(";"):
        normalized = " ".join(statement.split())
        if not normalized:
            continue
        upper = normalized.upper()
        if upper in {"BEGIN", "COMMIT"}:
            continue
        statements.append(f"{normalized};")

    return statements


async def initialize_database() -> None:
    """Apply the canonical schema and seed data for a fresh local database."""
    repo_root = Path(__file__).resolve().parents[2]
    schema_path = repo_root / "DB" / "schema.sql"
    seed_path = repo_root / "DB" / "seed.sql"

    async with engine.begin() as connection:
        await connection.execute(text("CREATE EXTENSION IF NOT EXISTS pgcrypto"))
        await connection.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))

        for statement in load_sql_statements(schema_path):
            await connection.execute(text(statement))

        has_jurisdictions = await connection.scalar(
            text("SELECT COUNT(*) > 0 FROM jurisdictions")
        )
        if not has_jurisdictions:
            for statement in load_sql_statements(seed_path):
                await connection.execute(text(statement))
