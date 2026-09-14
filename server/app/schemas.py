"""Pydantic request/response schemas for the API."""

import uuid
from datetime import date, datetime, time

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# --- Auth -----------------------------------------------------------------

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)
    name: str | None = None
    address: str | None = None
    postal_code: str = Field(min_length=1)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserPublic"


class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    external_id: str
    auth_provider: str
    name: str | None = None
    email: str | None = None
    address: str | None = None
    postal_code: str | None = None


# --- Jurisdictions ----------------------------------------------------------

class JurisdictionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    country: str
    country_code: str
    state: str | None = None
    state_code: str | None = None
    county: str | None = None
    township: str | None = None
    postal_codes: list[str] | None = None
    parent_id: str | None = None


# --- Recycling rules ---------------------------------------------------------

class RecyclingRuleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    jurisdiction_id: str
    material_name: str
    material_code: str | None = None
    category: str
    is_accepted: bool
    preparation_steps: list[str] | None = None
    rejection_reason: str | None = None
    special_notes: str | None = None


# --- Pickup schedule / calendar -----------------------------------------------

class PickupScheduleOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    jurisdiction_id: str
    schedule_type: str
    frequency: str
    day_of_week: int | None = None
    week_of_month: int | None = None
    accepted_materials: list[str] | None = None
    preparation_notes: str | None = None
    effective_from: date
    effective_to: date | None = None


class ScheduleExceptionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    jurisdiction_id: str
    exception_date: date
    reason: str | None = None
    new_date: date | None = None
    cancelled: bool | None = None


# --- Drop-off centers ----------------------------------------------------------

class CenterHoursOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    day_of_week: int
    open_time: time | None = None
    close_time: time | None = None
    notes: str | None = None


class DropoffCenterCreate(BaseModel):
    name: str = Field(min_length=1)
    center_type: str = Field(default="MUNICIPAL_CENTER")
    program_name: str | None = None
    address_line1: str = Field(min_length=1)
    address_line2: str | None = None
    city: str = Field(min_length=1)
    state: str | None = None
    postal_code: str | None = None
    country_code: str = Field(default="US")
    latitude: float
    longitude: float
    phone: str | None = None
    website: str | None = None
    email: str | None = None
    accepted_materials: list[str] = Field(default_factory=list)
    not_accepted: list[str] | None = None
    is_active: bool | None = True
    jurisdiction_id: str | None = None


class DropoffCenterUpdate(BaseModel):
    name: str | None = None
    center_type: str | None = None
    program_name: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    country_code: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    phone: str | None = None
    website: str | None = None
    email: str | None = None
    accepted_materials: list[str] | None = None
    not_accepted: list[str] | None = None
    is_active: bool | None = None
    jurisdiction_id: str | None = None


class DropoffCenterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    center_type: str
    program_name: str | None = None
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str | None = None
    postal_code: str | None = None
    country_code: str
    latitude: float
    longitude: float
    phone: str | None = None
    website: str | None = None
    email: str | None = None
    accepted_materials: list[str]
    not_accepted: list[str] | None = None
    is_active: bool | None = None
    jurisdiction_id: str | None = None
    hours: list[CenterHoursOut] = []
    distance_miles: float | None = None
    is_temporary: bool | None = None
    event_date: date | None = None


# --- Recycling programs ---------------------------------------------------------

class ProgramLocationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    location_name: str
    address_line1: str | None = None
    city: str | None = None
    state: str | None = None
    postal_code: str | None = None
    notes: str | None = None
    event_date: date | None = None
    latitude: float | None = None
    longitude: float | None = None


class RecyclingProgramOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    material_category: str
    program_name: str
    organization: str
    program_type: str
    accepts: list[str] | None = None
    not_accepted: list[str] | None = None
    how_it_works: str | None = None
    incentive: str | None = None
    website: str | None = None
    jurisdiction_id: str | None = None
    is_active: bool | None = None
    locations: list[ProgramLocationOut] = []


# --- Source documents -----------------------------------------------------------

class SourceDocumentOut(BaseModel):
    id: int
    title: str
    download_url: str
    document_type: str
    category_key: str | None = None
    source_url: str | None = None
    jurisdiction_id: str | None = None
    publication_year: int | None = None
    file_size_bytes: int | None = None
    notes: str | None = None


# --- Scan history --------------------------------------------------------------

class ScanHistoryCreate(BaseModel):
    jurisdiction_id: str | None = None
    image_key: str | None = None
    objects: dict
    items_count: int = Field(ge=0)
    recyclable_count: int = Field(ge=0)


class ScanHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: int
    jurisdiction_id: str | None = None
    scanned_at: datetime | None = None
    image_key: str | None = None
    objects: dict
    items_count: int
    recyclable_count: int


class ImpactSummary(BaseModel):
    user_id: int
    total_items_scanned: int
    items_correctly_recycled: int


# --- Location ---------------------------------------------------------------

class LocationResolveResponse(BaseModel):
    latitude: float | None = None
    longitude: float | None = None
    country: str
    country_code: str
    state: str | None = None
    state_code: str | None = None
    county: str | None = None
    township: str | None = None
    postal_code: str | None = None
    jurisdiction_id: str


# --- Lookup -----------------------------------------------------------------

class LookupResultOut(BaseModel):
    id: uuid.UUID
    item_name: str
    material_code: str | None = None
    recyclable: bool
    category: str
    preparation_steps: list[str] = []
    notes: str
    jurisdiction_id: str
    jurisdiction_name: str


# --- Calendar ---------------------------------------------------------------

class CalendarEventOut(BaseModel):
    date: date
    type: str
    materials: list[str]
    notes: str | None = None


class HolidayDelayOut(BaseModel):
    holiday: str | None = None
    date: date
    impact: str


class CalendarResponse(BaseModel):
    jurisdiction_id: str
    schedule: list[CalendarEventOut]
    holiday_delays: list[HolidayDelayOut]
