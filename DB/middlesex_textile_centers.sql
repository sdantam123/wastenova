-- New Middlesex County textile drop-off sites not already represented in
-- dropoff_centers (the other 6 rotation sites already exist and were
-- updated to include TEXTILES in accepted_materials separately).
-- Source: Middlesex County 2026 Recycling and Solid Waste Guide.
-- Coordinates geocoded via OpenStreetMap Nominatim; Dunellen address
-- resolved to nearest matching street segment, house-number precision
-- not confirmed.

BEGIN;

INSERT INTO dropoff_centers (
  name, center_type, program_name, address_line1, city, state, postal_code,
  country_code, latitude, longitude, accepted_materials, is_active, jurisdiction_id
) VALUES
  (
    'Middlesex Borough Recycling Center', 'MUNICIPAL_CENTER', 'Textile Recycling',
    '1200 Mountain Avenue', 'Middlesex', 'NJ', '08846', 'US',
    40.5761936, -74.4966684, ARRAY['TEXTILES'], TRUE, 'jur_us_nj_middlesex_middlesexborough'
  ),
  (
    'Dunellen Public Works', 'MUNICIPAL_CENTER', 'Textile Recycling',
    '235 Hall Street', 'Dunellen', 'NJ', '08812', 'US',
    40.5847496, -74.4695288, ARRAY['TEXTILES'], TRUE, 'jur_us_nj_middlesex_dunellen'
  ),
  (
    'New Brunswick Public Works', 'MUNICIPAL_CENTER', 'Textile Recycling',
    '400 Jersey Avenue', 'New Brunswick', 'NJ', '08901', 'US',
    40.4841401, -74.4634318, ARRAY['TEXTILES'], TRUE, 'jur_us_nj_middlesex_newbrunswick'
  ),
  (
    'Helmetta Recycling (Behind Municipal Building)', 'MUNICIPAL_CENTER', 'Textile Recycling',
    '51 Main Street', 'Helmetta', 'NJ', '08828', 'US',
    40.3784931, -74.4181787, ARRAY['TEXTILES'], TRUE, 'jur_us_nj_middlesex_helmetta'
  ),
  (
    'South Brunswick Recycling Center', 'MUNICIPAL_CENTER', 'Textile Recycling',
    '540 Ridge Road', 'Monmouth Junction', 'NJ', '08852', 'US',
    40.3854847, -74.5409323, ARRAY['TEXTILES'], TRUE, 'jur_us_nj_middlesex_southbrunswick'
  );

COMMIT;
