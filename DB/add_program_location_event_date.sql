-- Adds a real DATE column for one-off dated program events (e.g. a single
-- paper shredding event day at a given park), and backfills it for the
-- Middlesex County Residential Paper Shredding Events program (id 139)
-- from source_docs/nj/Middlesex_county_PaperShredding.png.

ALTER TABLE program_locations ADD COLUMN IF NOT EXISTS event_date DATE;

UPDATE program_locations SET event_date = '2026-03-22' WHERE id = 123; -- Old Bridge Recycling Center
UPDATE program_locations SET event_date = '2026-04-10' WHERE id = 124; -- Merrill Park
UPDATE program_locations SET event_date = '2026-04-18' WHERE id = 125; -- Sayreville Recycling Center (Fort Grumpy)
UPDATE program_locations SET event_date = '2026-05-02' WHERE id = 126; -- Babbage Park
UPDATE program_locations SET event_date = '2026-05-08' WHERE id = 127; -- Crystal Springs Waterpark
UPDATE program_locations SET event_date = '2026-06-07' WHERE id = 128; -- Papaianni Park
UPDATE program_locations SET event_date = '2026-06-27' WHERE id = 129; -- Spotswood High School Parking Lot
UPDATE program_locations SET event_date = '2026-08-30' WHERE id = 130; -- Beech Woods Park
UPDATE program_locations SET event_date = '2026-09-27' WHERE id = 131; -- Woodbridge Public Works
UPDATE program_locations SET event_date = '2026-10-09' WHERE id = 132; -- Donaldson Park
UPDATE program_locations SET event_date = '2026-10-17' WHERE id = 133; -- Cranbury School
UPDATE program_locations SET event_date = '2026-11-06' WHERE id = 134; -- Thompson Park
