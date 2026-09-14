-- Adds coordinates for the 4 NJ Hospital Association Safe Syringe Program
-- locations (program id 143) per source_docs/nj/Middlesex_county_Syringe.png,
-- so they can be plotted on the map alongside the drop-off list.

UPDATE program_locations SET latitude = 40.4966000, longitude = -74.4479000 WHERE id = 119; -- St. Peter's University Hospital, New Brunswick
UPDATE program_locations SET latitude = 40.3395000, longitude = -74.5952000 WHERE id = 120; -- Penn Medicine Princeton Health, Plainsboro
UPDATE program_locations SET latitude = 40.5233000, longitude = -74.3862000 WHERE id = 121; -- JFK Medical Center, Edison
UPDATE program_locations SET latitude = 40.5715000, longitude = -74.6127000 WHERE id = 122; -- RWJ University Hospital Somerset, Somerville
