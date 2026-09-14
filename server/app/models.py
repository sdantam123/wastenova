"""SQLAlchemy ORM models mapping to the tables defined in DB/schema.sql.

These models describe the existing schema; they intentionally avoid
`Base.metadata.create_all()` in favor of the canonical `DB/schema.sql` /
`DB/seed.sql` files being the source of truth for the database structure.
"""

import uuid
from datetime import date, datetime, time

from sqlalchemy import (
    ARRAY,
    BigInteger,
    Boolean,
    CheckConstraint,
    Date,
    ForeignKey,
    SmallInteger,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import JSONB, TIMESTAMP, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        CheckConstraint("auth_provider IN ('apple', 'google', 'password')", name="users_auth_provider_chk"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    external_id: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    auth_provider: Mapped[str] = mapped_column(String(20), nullable=False)
    name: Mapped[str | None] = mapped_column(String(255))
    email: Mapped[str | None] = mapped_column(String(255))
    password_hash: Mapped[str | None] = mapped_column(String(255))
    address: Mapped[str | None] = mapped_column(String(500))
    postal_code: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    updated_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))


class Jurisdiction(Base):
    __tablename__ = "jurisdictions"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    country: Mapped[str] = mapped_column(String(100), nullable=False)
    country_code: Mapped[str] = mapped_column(String(2), nullable=False)
    state: Mapped[str | None] = mapped_column(String(100))
    state_code: Mapped[str | None] = mapped_column(String(10))
    county: Mapped[str | None] = mapped_column(String(100))
    township: Mapped[str | None] = mapped_column(String(100))
    postal_codes: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    parent_id: Mapped[str | None] = mapped_column(String(100), ForeignKey("jurisdictions.id"))
    data_source: Mapped[str | None] = mapped_column(String(255))
    last_updated: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))


class RecyclingRule(Base):
    __tablename__ = "recycling_rules"
    __table_args__ = (
        UniqueConstraint("jurisdiction_id", "material_name"),
        CheckConstraint(
            "category IN ('CURBSIDE','DROPOFF_CENTER','MEDICAL_DROPOFF','HAZARDOUS','COMPOST','NOT_RECYCLABLE','REUSE')",
            name="recycling_rules_category_chk",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    jurisdiction_id: Mapped[str] = mapped_column(String(100), ForeignKey("jurisdictions.id"), nullable=False)
    material_name: Mapped[str] = mapped_column(String(255), nullable=False)
    material_code: Mapped[str | None] = mapped_column(String(20))
    category: Mapped[str] = mapped_column(String(50), nullable=False)
    is_accepted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    preparation_steps: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    rejection_reason: Mapped[str | None] = mapped_column(Text)
    special_notes: Mapped[str | None] = mapped_column(Text)
    effective_from: Mapped[date | None] = mapped_column(Date)
    effective_to: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    updated_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))


class PickupSchedule(Base):
    __tablename__ = "pickup_schedules"
    __table_args__ = (
        CheckConstraint(
            "schedule_type IN ('RECYCLING','TRASH','YARD_WASTE','BULK_PICKUP')",
            name="pickup_schedules_schedule_type_chk",
        ),
        CheckConstraint(
            "frequency IN ('WEEKLY','BIWEEKLY','MONTHLY')",
            name="pickup_schedules_frequency_chk",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    jurisdiction_id: Mapped[str] = mapped_column(String(100), ForeignKey("jurisdictions.id"), nullable=False)
    schedule_type: Mapped[str] = mapped_column(String(50), nullable=False)
    frequency: Mapped[str] = mapped_column(String(20), nullable=False)
    day_of_week: Mapped[int | None] = mapped_column(SmallInteger)
    week_of_month: Mapped[int | None] = mapped_column(SmallInteger)
    accepted_materials: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    preparation_notes: Mapped[str | None] = mapped_column(Text)
    effective_from: Mapped[date] = mapped_column(Date, nullable=False)
    effective_to: Mapped[date | None] = mapped_column(Date)
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))


class ScheduleException(Base):
    __tablename__ = "schedule_exceptions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    jurisdiction_id: Mapped[str] = mapped_column(String(100), ForeignKey("jurisdictions.id"), nullable=False)
    exception_date: Mapped[date] = mapped_column(Date, nullable=False)
    reason: Mapped[str | None] = mapped_column(String(255))
    new_date: Mapped[date | None] = mapped_column(Date)
    cancelled: Mapped[bool | None] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))


class DropoffCenter(Base):
    __tablename__ = "dropoff_centers"
    __table_args__ = (
        CheckConstraint(
            "center_type IN ('COUNTY_CENTER','MUNICIPAL_CENTER','RETAIL_DROPOFF','PHARMACY_DROPBOX','EWASTE_EVENT')",
            name="dropoff_centers_center_type_chk",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    center_type: Mapped[str] = mapped_column(String(50), nullable=False)
    program_name: Mapped[str | None] = mapped_column(String(255))
    address_line1: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line2: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str | None] = mapped_column(String(100))
    postal_code: Mapped[str | None] = mapped_column(String(20))
    country_code: Mapped[str] = mapped_column(String(2), nullable=False)
    latitude: Mapped[float] = mapped_column(nullable=False)
    longitude: Mapped[float] = mapped_column(nullable=False)
    phone: Mapped[str | None] = mapped_column(String(30))
    website: Mapped[str | None] = mapped_column(String(500))
    email: Mapped[str | None] = mapped_column(String(255))
    accepted_materials: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False)
    not_accepted: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)
    is_temporary: Mapped[bool | None] = mapped_column(Boolean, default=False)
    event_date: Mapped[date | None] = mapped_column(Date)
    jurisdiction_id: Mapped[str | None] = mapped_column(String(100), ForeignKey("jurisdictions.id"))
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    updated_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))

    hours: Mapped[list["CenterHours"]] = relationship(back_populates="center")


class CenterHours(Base):
    __tablename__ = "center_hours"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    center_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("dropoff_centers.id", ondelete="CASCADE"), nullable=False
    )
    day_of_week: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    open_time: Mapped[time | None] = mapped_column(Time)
    close_time: Mapped[time | None] = mapped_column(Time)
    notes: Mapped[str | None] = mapped_column(String(255))

    center: Mapped["DropoffCenter"] = relationship(back_populates="hours")


class RecyclingProgram(Base):
    __tablename__ = "recycling_programs"
    __table_args__ = (
        CheckConstraint(
            "program_type IN ('MAIL_IN','RETAIL_TAKEBACK','LOCAL_EVENT','MUNICIPAL')",
            name="recycling_programs_program_type_chk",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    material_category: Mapped[str] = mapped_column(String(100), nullable=False)
    program_name: Mapped[str] = mapped_column(String(255), nullable=False)
    organization: Mapped[str] = mapped_column(String(255), nullable=False)
    program_type: Mapped[str] = mapped_column(String(20), nullable=False)
    accepts: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    not_accepted: Mapped[list[str] | None] = mapped_column(ARRAY(Text))
    how_it_works: Mapped[str | None] = mapped_column(Text)
    incentive: Mapped[str | None] = mapped_column(String(255))
    website: Mapped[str | None] = mapped_column(String(500))
    jurisdiction_id: Mapped[str | None] = mapped_column(String(100), ForeignKey("jurisdictions.id"))
    is_active: Mapped[bool | None] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    updated_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))

    locations: Mapped[list["ProgramLocation"]] = relationship(back_populates="program")


class ProgramLocation(Base):
    __tablename__ = "program_locations"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    program_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("recycling_programs.id", ondelete="CASCADE"), nullable=False
    )
    location_name: Mapped[str] = mapped_column(String(255), nullable=False)
    address_line1: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str | None] = mapped_column(String(100))
    state: Mapped[str | None] = mapped_column(String(100))
    postal_code: Mapped[str | None] = mapped_column(String(20))
    notes: Mapped[str | None] = mapped_column(String(255))
    event_date: Mapped[date | None] = mapped_column(Date)
    latitude: Mapped[float | None] = mapped_column()
    longitude: Mapped[float | None] = mapped_column()

    program: Mapped["RecyclingProgram"] = relationship(back_populates="locations")


class SourceDocument(Base):
    __tablename__ = "source_documents"
    __table_args__ = (
        CheckConstraint(
            "document_type IN ('PDF','IMAGE')",
            name="source_documents_document_type_chk",
        ),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    document_type: Mapped[str] = mapped_column(String(20), nullable=False, default="PDF")
    category_key: Mapped[str | None] = mapped_column(String(50))
    source_url: Mapped[str | None] = mapped_column(String(500))
    jurisdiction_id: Mapped[str | None] = mapped_column(String(100), ForeignKey("jurisdictions.id"))
    publication_year: Mapped[int | None] = mapped_column(SmallInteger)
    file_size_bytes: Mapped[int | None] = mapped_column(BigInteger)
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))


class ScanHistory(Base):
    __tablename__ = "scan_history"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    jurisdiction_id: Mapped[str | None] = mapped_column(String(100), ForeignKey("jurisdictions.id"))
    scanned_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    image_key: Mapped[str | None] = mapped_column(String(500))
    objects: Mapped[dict] = mapped_column(JSONB, nullable=False)
    items_count: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    recyclable_count: Mapped[int] = mapped_column(SmallInteger, nullable=False)


class UserNotification(Base):
    __tablename__ = "user_notifications"
    __table_args__ = (UniqueConstraint("user_id", "jurisdiction_id"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    jurisdiction_id: Mapped[str | None] = mapped_column(String(100), ForeignKey("jurisdictions.id"))
    apns_token: Mapped[str | None] = mapped_column(String(512))
    notify_recycling: Mapped[bool | None] = mapped_column(Boolean, default=True)
    notify_yard_waste: Mapped[bool | None] = mapped_column(Boolean, default=True)
    notify_bulk: Mapped[bool | None] = mapped_column(Boolean, default=False)
    reminder_time: Mapped[time | None] = mapped_column(Time)
    created_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
    updated_at: Mapped[datetime | None] = mapped_column(TIMESTAMP(timezone=True))
