from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import hashlib
import os

app = FastAPI(title="WasteWiz API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class AuthUser(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[str] = None


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: AuthUser


class Jurisdiction(BaseModel):
    id: str
    country: str
    state: Optional[str] = None
    county: Optional[str] = None
    township: Optional[str] = None
    postal_codes: Optional[List[str]] = None


class ResolvedLocation(BaseModel):
    jurisdiction_id: str
    postal_code: Optional[str] = None
    country: str
    state: Optional[str] = None
    county: Optional[str] = None
    township: Optional[str] = None


class LookupResult(BaseModel):
    id: str
    item_name: str
    material_code: Optional[str] = None
    recyclable: bool
    category: str
    preparation_steps: List[str] = []
    notes: str
    jurisdiction_name: str


class CalendarEvent(BaseModel):
    date: str
    type: str
    materials: List[str] = []
    notes: Optional[str] = None


class CalendarResponse(BaseModel):
    schedule: List[CalendarEvent]


class CenterHour(BaseModel):
    day_of_week: int
    open_time: Optional[str] = None
    close_time: Optional[str] = None
    notes: Optional[str] = None


class DropoffCenter(BaseModel):
    id: str
    name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    latitude: float
    longitude: float
    accepted_materials: List[str]
    hours: List[CenterHour]
    distance_miles: Optional[float] = None


DATA_JURISDICTIONS = [
    {
        "id": "us-ny-brooklyn",
        "country": "United States",
        "state": "New York",
        "county": "Kings",
        "township": "Brooklyn",
        "postal_codes": ["11201", "11203", "11210", "11211"],
    },
    {
        "id": "ca-on-toronto",
        "country": "Canada",
        "state": "Ontario",
        "county": "Toronto",
        "township": "Toronto",
        "postal_codes": ["M5V", "M5H", "M4B"],
    },
    {
        "id": "gb-london",
        "country": "United Kingdom",
        "state": "England",
        "county": "Greater London",
        "township": "London",
        "postal_codes": ["SW1A", "EC1A", "E1"],
    },
]

DATA_RULES = {
    "battery": {
        "material_code": "BATTERY",
        "recyclable": True,
        "category": "HAZARDOUS",
        "preparation_steps": ["Tape terminals", "Place in a sealed bag"],
        "notes": "Many regions require separate household hazardous waste handling.",
    },
    "pizza box": {
        "material_code": "PAPER",
        "recyclable": True,
        "category": "CURBSIDE",
        "preparation_steps": ["Remove food residue", "Recycle if clean"],
        "notes": "Only recycle if the box is clean and dry.",
    },
    "paint can": {
        "material_code": "PAINT",
        "recyclable": False,
        "category": "HAZARDOUS",
        "preparation_steps": ["Take to a household hazardous waste drop-off"],
        "notes": "Paint cans often require special disposal.",
    },
}

DATA_CENTERS = [
    {
        "id": "center-1",
        "name": "Green Loop Drop-Off",
        "address_line1": "120 Broadway",
        "address_line2": None,
        "city": "Brooklyn",
        "state": "NY",
        "postal_code": "11201",
        "phone": "+1-718-555-0198",
        "website": "https://example.com",
        "latitude": 40.7098,
        "longitude": -74.0105,
        "accepted_materials": ["PLASTIC", "GLASS", "METAL", "BATTERIES"],
        "hours": [
            {"day_of_week": 0, "open_time": "09:00", "close_time": "17:00", "notes": None},
            {"day_of_week": 1, "open_time": "09:00", "close_time": "17:00", "notes": None},
            {"day_of_week": 2, "open_time": "09:00", "close_time": "17:00", "notes": None},
            {"day_of_week": 3, "open_time": "09:00", "close_time": "17:00", "notes": None},
            {"day_of_week": 4, "open_time": "09:00", "close_time": "17:00", "notes": None},
            {"day_of_week": 5, "open_time": "09:00", "close_time": "17:00", "notes": None},
            {"day_of_week": 6, "open_time": "10:00", "close_time": "15:00", "notes": None},
        ],
    },
    {
        "id": "center-2",
        "name": "Harbor Reuse Hub",
        "address_line1": "44 King St W",
        "address_line2": None,
        "city": "Toronto",
        "state": "ON",
        "postal_code": "M5H",
        "phone": "+1-416-555-0142",
        "website": None,
        "latitude": 43.6473,
        "longitude": -79.3816,
        "accepted_materials": ["PAPER", "CARDBOARD", "ELECTRONICS", "TEXTILES"],
        "hours": [
            {"day_of_week": 0, "open_time": "08:00", "close_time": "16:00", "notes": None},
            {"day_of_week": 1, "open_time": "08:00", "close_time": "16:00", "notes": None},
            {"day_of_week": 2, "open_time": "08:00", "close_time": "16:00", "notes": None},
            {"day_of_week": 3, "open_time": "08:00", "close_time": "16:00", "notes": None},
            {"day_of_week": 4, "open_time": "08:00", "close_time": "16:00", "notes": None},
            {"day_of_week": 5, "open_time": "08:00", "close_time": "16:00", "notes": None},
            {"day_of_week": 6, "open_time": "10:00", "close_time": "14:00", "notes": None},
        ],
    },
]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/jurisdictions", response_model=List[Jurisdiction])
def get_jurisdictions():
    return DATA_JURISDICTIONS


@app.get("/location/resolve-by-postal", response_model=ResolvedLocation)
def resolve_by_postal(postalCode: str = Query(..., alias="postalCode"), countryCode: Optional[str] = Query(None, alias="countryCode")):
    match = next((item for item in DATA_JURISDICTIONS if postalCode.upper() in [code.upper() for code in item.get("postal_codes", [])]), None)
    if not match:
        raise HTTPException(status_code=404, detail="Jurisdiction not found")

    return {
        "jurisdiction_id": match["id"],
        "postal_code": postalCode,
        "country": match["country"],
        "state": match["state"],
        "county": match["county"],
        "township": match["township"],
    }


@app.get("/lookup", response_model=List[LookupResult])
def lookup_item(item: str = Query(...), jurisdictionId: Optional[str] = Query(None)):
    key = item.strip().lower()
    rule = DATA_RULES.get(key)
    if not rule:
        return []

    jurisdiction_name = "Global default"
    if jurisdictionId:
        match = next((item for item in DATA_JURISDICTIONS if item["id"] == jurisdictionId), None)
        if match:
            jurisdiction_name = f"{match['township'] or match['county'] or match['state'] or match['country']}"

    return [{
        "id": f"result-{hashlib.md5(key.encode()).hexdigest()[:8]}",
        "item_name": item,
        "material_code": rule["material_code"],
        "recyclable": rule["recyclable"],
        "category": rule["category"],
        "preparation_steps": rule["preparation_steps"],
        "notes": rule["notes"],
        "jurisdiction_name": jurisdiction_name,
    }]


@app.get("/calendar/{jurisdiction_id}", response_model=CalendarResponse)
def get_calendar(jurisdiction_id: str):
    schedule = [
        {"date": "2026-08-12", "type": "RECYCLING", "materials": ["Paper", "Plastic"], "notes": "Please place materials at the curb by 7 AM."},
        {"date": "2026-08-19", "type": "TRASH", "materials": ["General waste"], "notes": None},
    ]
    return {"schedule": schedule}


@app.get("/centers", response_model=List[DropoffCenter])
def get_centers(lat: float = Query(...), lng: float = Query(...), material: Optional[str] = Query(None), radius: Optional[int] = Query(5)):
    centers = DATA_CENTERS
    if material:
        centers = [c for c in centers if material.upper() in c["accepted_materials"]]
    return centers


@app.post("/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest):
    if payload.email != "admin@example.com" or payload.password != "password123":
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return AuthResponse(
        access_token="demo-token",
        refresh_token="demo-refresh-token",
        user=AuthUser(id="user-1", name="Admin", email=payload.email),
    )


@app.post("/auth/register", response_model=AuthResponse)
def register(payload: RegisterRequest):
    return AuthResponse(
        access_token="demo-token",
        refresh_token="demo-refresh-token",
        user=AuthUser(id="user-2", name=payload.name, email=payload.email),
    )
