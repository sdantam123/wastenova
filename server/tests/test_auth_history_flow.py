import uuid

from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy import delete, select
from sqlalchemy.pool import NullPool

from app.config import settings
from app.main import app
from app.models import ScanHistory, User


def _cleanup_user(email: str) -> None:
    async def _delete() -> None:
        engine = create_async_engine(settings.database_url, poolclass=NullPool)
        session_factory = async_sessionmaker(bind=engine, expire_on_commit=False)
        async with session_factory() as session:
            result = await session.execute(select(User).where(User.email == email))
            user = result.scalar_one_or_none()
            if user is None:
                await engine.dispose()
                return

            await session.execute(delete(ScanHistory).where(ScanHistory.user_id == user.id))
            await session.delete(user)
            await session.commit()
        await engine.dispose()

    import asyncio

    asyncio.run(_delete())


def test_register_login_and_history_flow() -> None:
    email = f"wastewiz-test-{uuid.uuid4().hex[:12]}@example.com"
    password = "TestPass123!"
    headers: dict[str, str] = {}

    _cleanup_user(email)
    try:
        with TestClient(app) as client:
            register_response = client.post(
                "/auth/register",
                json={"email": email, "password": password, "name": "WasteWiz Test"},
            )
            assert register_response.status_code == 201
            register_payload = register_response.json()
            assert register_payload["user"]["email"] == email
            assert register_payload["access_token"]
            assert register_payload["refresh_token"]

            login_response = client.post(
                "/auth/login",
                json={"email": email, "password": password},
            )
            assert login_response.status_code == 200
            login_payload = login_response.json()
            assert login_payload["user"]["email"] == email

            headers = {"Authorization": f"Bearer {login_payload['access_token']}"}
            create_history_response = client.post(
                "/history",
                headers=headers,
                json={
                    "jurisdiction_id": "jur_us_nj_hudson_jerseycity",
                    "image_key": "tests/example-image.jpg",
                    "objects": {"items": [{"label": "PET bottle", "recyclable": True}]},
                    "items_count": 1,
                    "recyclable_count": 1,
                },
            )
            assert create_history_response.status_code == 201
            history_entry = create_history_response.json()
            assert history_entry["jurisdiction_id"] == "jur_us_nj_hudson_jerseycity"
            assert history_entry["items_count"] == 1

            history_response = client.get("/history", headers=headers)
            assert history_response.status_code == 200
            history_payload = history_response.json()
            assert len(history_payload) >= 1
            assert any(entry["id"] == history_entry["id"] for entry in history_payload)

            impact_response = client.get("/history/impact", headers=headers)
            assert impact_response.status_code == 200
            impact_payload = impact_response.json()
            assert impact_payload["total_items_scanned"] >= 1
            assert impact_payload["items_correctly_recycled"] >= 1
    finally:
        _cleanup_user(email)