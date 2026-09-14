-- Adds latitude/longitude to program_locations so one-off dated events
-- (e.g. the Middlesex County paper shredding schedule) can be plotted on
-- the map the same way dropoff_centers are. Backfills coordinates for the
-- 12 Residential Paper Shredding Events locations (program id 139); reuses
-- exact coordinates already on file for locations that are also existing
-- dropoff_centers (Old Bridge Recycling Center, Sayreville Recycling
-- Center, Woodbridge Public Works), and town-center-level coordinates for
-- the rest (parks/schools without their own dropoff_centers row).

ALTER TABLE program_locations ADD COLUMN IF NOT EXISTS latitude NUMERIC(9,7);
ALTER TABLE program_locations ADD COLUMN IF NOT EXISTS longitude NUMERIC(10,7);

UPDATE program_locations SET latitude = 40.4034213, longitude = -74.2979160 WHERE id = 123; -- Old Bridge Recycling Center (matches dropoff_centers.id 12)
UPDATE program_locations SET latitude = 40.5806000, longitude = -74.3096000 WHERE id = 124; -- Merrill Park, Colonia
UPDATE program_locations SET latitude = 40.4340914, longitude = -74.3356975 WHERE id = 125; -- Sayreville Recycling Center (matches dropoff_centers.id 14)
UPDATE program_locations SET latitude = 40.4632000, longitude = -74.4654000 WHERE id = 126; -- Babbage Park, North Brunswick
UPDATE program_locations SET latitude = 40.4356000, longitude = -74.3987000 WHERE id = 127; -- Crystal Springs Waterpark, East Brunswick
UPDATE program_locations SET latitude = 40.5187000, longitude = -74.3826000 WHERE id = 128; -- Papaianni Park, Edison
UPDATE program_locations SET latitude = 40.3892000, longitude = -74.3921000 WHERE id = 129; -- Spotswood High School, Spotswood
UPDATE program_locations SET latitude = 40.3401000, longitude = -74.5387000 WHERE id = 130; -- Beech Woods Park, South Brunswick
UPDATE program_locations SET latitude = 40.5148207, longitude = -74.3016884 WHERE id = 131; -- Woodbridge Public Works (matches dropoff_centers.id 15)
UPDATE program_locations SET latitude = 40.5001000, longitude = -74.4229000 WHERE id = 132; -- Donaldson Park, Highland Park
UPDATE program_locations SET latitude = 40.3117000, longitude = -74.5140000 WHERE id = 133; -- Cranbury School, Cranbury
UPDATE program_locations SET latitude = 40.3179000, longitude = -74.4293000 WHERE id = 134; -- Thompson Park, Monroe Township
