from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from urllib.request import Request, urlopen

from sqlalchemy import text

from app.database import engine

WIKIPEDIA_RAW_URL = (
    "https://en.wikipedia.org/w/index.php?title=List_of_municipalities_in_New_Jersey&action=raw"
)
USER_AGENT = "Mozilla/5.0 (compatible; WasteWizImporter/1.0)"
SOURCE_NAME = "wikipedia:list_of_municipalities_in_new_jersey"


@dataclass(frozen=True)
class Municipality:
    township: str
    county: str

    @property
    def county_slug(self) -> str:
        county_name = self.county.removesuffix(" County")
        return slugify(county_name)

    @property
    def jurisdiction_id(self) -> str:
        return f"jur_us_nj_{self.county_slug}_{slugify(self.township)}"


def slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", value.lower())


def strip_markup(value: str) -> str:
    value = re.sub(r"<ref[^>]*>.*?</ref>", "", value, flags=re.DOTALL)
    value = re.sub(r"\{\{#tag:ref\|.*?\}\}", "", value, flags=re.DOTALL)
    value = re.sub(r"\{\{.*?\}\}", "", value, flags=re.DOTALL)

    def replace_link(match: re.Match[str]) -> str:
        target = match.group(1)
        label = match.group(2) or target
        return label

    value = re.sub(r"\[\[([^\]|]+)(?:\|([^\]]+))?\]\]", replace_link, value)
    value = value.replace("''", "")
    value = re.sub(r"\s+", " ", value)
    return value.strip()


def fetch_source_text() -> str:
    request = Request(WIKIPEDIA_RAW_URL, headers={"User-Agent": USER_AGENT})
    with urlopen(request) as response:
        return response.read().decode("utf-8")


def extract_table(source_text: str) -> str:
    table_start = source_text.find('{| class="wikitable sortable"')
    if table_start == -1:
        raise ValueError("Could not find the New Jersey municipalities table")

    table_end = source_text.find("\n|}", table_start)
    if table_end == -1:
        raise ValueError("Could not find the end of the municipalities table")

    return source_text[table_start:table_end]


def parse_municipalities(source_text: str) -> list[Municipality]:
    table_text = extract_table(source_text)
    municipalities: list[Municipality] = []

    for row in table_text.split("|-\n"):
        lines = [line.strip() for line in row.splitlines() if line.strip()]
        if not lines or lines[0].startswith("{"):
            continue
        if any(line.startswith("!") for line in lines):
            continue

        cells = [line[1:].strip() for line in lines if line.startswith("|")]
        if len(cells) < 3:
            continue

        township = strip_markup(cells[0])
        county_name = strip_markup(cells[2])
        if not township or not county_name:
            continue

        county = county_name if county_name.endswith(" County") else f"{county_name} County"
        municipalities.append(Municipality(township=township, county=county))

    unique: dict[str, Municipality] = {}
    for municipality in municipalities:
        unique[municipality.jurisdiction_id] = municipality
    return list(unique.values())


async def import_municipalities(municipalities: list[Municipality]) -> None:
    now = datetime.now(timezone.utc)
    statement = text(
        """
        INSERT INTO jurisdictions (
            id,
            country,
            country_code,
            state,
            state_code,
            county,
            township,
            postal_codes,
            parent_id,
            data_source,
            last_updated
        ) VALUES (
            :id,
            'United States',
            'US',
            'New Jersey',
            'NJ',
            :county,
            :township,
            NULL,
            'jur_us_nj',
            :data_source,
            :last_updated
        )
        ON CONFLICT (id) DO UPDATE SET
            country = EXCLUDED.country,
            country_code = EXCLUDED.country_code,
            state = EXCLUDED.state,
            state_code = EXCLUDED.state_code,
            county = EXCLUDED.county,
            township = EXCLUDED.township,
            parent_id = EXCLUDED.parent_id,
            data_source = EXCLUDED.data_source,
            last_updated = EXCLUDED.last_updated
        """
    )

    async with engine.begin() as connection:
        await connection.execute(
            text(
                """
                DELETE FROM jurisdictions
                WHERE state_code = 'NJ'
                  AND parent_id = 'jur_us_nj'
                  AND data_source = :data_source
                """
            ),
            {"data_source": SOURCE_NAME},
        )
        for municipality in municipalities:
            await connection.execute(
                statement,
                {
                    "id": municipality.jurisdiction_id,
                    "county": municipality.county,
                    "township": municipality.township,
                    "data_source": SOURCE_NAME,
                    "last_updated": now,
                },
            )


async def main() -> None:
    source_text = fetch_source_text()
    municipalities = parse_municipalities(source_text)
    if not municipalities:
        raise ValueError("No New Jersey municipalities were parsed from the source page")

    await import_municipalities(municipalities)
    print(f"Imported {len(municipalities)} New Jersey municipalities into jurisdictions")


if __name__ == "__main__":
    asyncio.run(main())