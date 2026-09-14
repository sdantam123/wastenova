-- Converts the "NJ Hospital Association Safe Syringe Program" from a
-- recycling_programs/program_locations entry into real dropoff_centers rows,
-- so syringe disposal shows in the standard Drop-off Locations list+map
-- (like Tire/Paint/etc.) instead of under Programs.

BEGIN;

INSERT INTO dropoff_centers (name, center_type, program_name, address_line1, city, state, postal_code, country_code, latitude, longitude, phone, accepted_materials, jurisdiction_id)
VALUES
  ('St. Peter''s University Hospital', 'COUNTY_CENTER', 'NJ Hospital Association Safe Syringe Program', '254 Easton Avenue', 'New Brunswick', 'NJ', '08901', 'US', 40.4966000, -74.4479000, '732-745-8600 x6010', ARRAY['SYRINGES'], 'jur_us_nj_middlesex'),
  ('Penn Medicine Princeton Health', 'COUNTY_CENTER', 'NJ Hospital Association Safe Syringe Program', '1 Plainsboro Road', 'Plainsboro', 'NJ', '08536', 'US', 40.3395000, -74.5952000, '609-853-6140', ARRAY['SYRINGES'], 'jur_us_nj_middlesex'),
  ('JFK Medical Center', 'COUNTY_CENTER', 'NJ Hospital Association Safe Syringe Program', '65 James Street', 'Edison', 'NJ', '08818', 'US', 40.5233000, -74.3862000, '732-321-7539', ARRAY['SYRINGES'], 'jur_us_nj_middlesex'),
  ('RWJ University Hospital Somerset', 'COUNTY_CENTER', 'NJ Hospital Association Safe Syringe Program', '110 Rehill Avenue', 'Somerville', 'NJ', '08876', 'US', 40.5715000, -74.6127000, '908-685-2200', ARRAY['SYRINGES'], 'jur_us_nj_middlesex');

DELETE FROM recycling_programs WHERE id = 143; -- cascades to program_locations

COMMIT;
