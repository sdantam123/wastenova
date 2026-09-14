from pathlib import Path

from app.database import load_sql_statements


def test_load_sql_statements_returns_schema_statements() -> None:
    schema_path = Path(__file__).resolve().parents[1] / ".." / "DB" / "schema.sql"

    statements = load_sql_statements(schema_path)

    assert statements
    assert any("CREATE TABLE IF NOT EXISTS users" in statement for statement in statements)
