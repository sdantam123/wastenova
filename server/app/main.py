from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import initialize_database
from app.routers import auth, calendar, centers, history, jurisdictions, location, lookup, programs, rules, source_documents

app = FastAPI(
    title="Global Recycle API",
    description="Backend API for the Recycle Compass / Global Recycle project.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_server_root = Path(__file__).resolve().parents[1]
app.mount(
    "/static/source-documents",
    StaticFiles(directory=_server_root / "static" / "source-documents"),
    name="source-documents",
)

app.include_router(auth.router)
app.include_router(location.router)
app.include_router(lookup.router)
app.include_router(jurisdictions.router)
app.include_router(rules.router)
app.include_router(calendar.router)
app.include_router(centers.router)
app.include_router(programs.router)
app.include_router(source_documents.router)
app.include_router(history.router)


@app.on_event("startup")
async def startup_event() -> None:
    await initialize_database()


@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
