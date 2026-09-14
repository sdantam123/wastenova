-- Middlesex County balloon disposal drop-off locations, from
-- source_docs/nj/Middlesex_county_Balloon.png. Township-scoped (Plainsboro
-- and Cranbury only) since this is a local township program, not a
-- county-wide one.

INSERT INTO dropoff_centers (name, center_type, program_name, address_line1, city, state, postal_code, country_code, latitude, longitude, phone, accepted_materials, jurisdiction_id)
VALUES
  ('Plainsboro Recreation Center', 'MUNICIPAL_CENTER', 'Balloon Disposal Program', '641 Plainsboro Road', 'Plainsboro', 'NJ', '08536', 'US', 40.3222992, -74.5912869, '609-799-0099', ARRAY['BALLOONS'], 'jur_us_nj_middlesex_plainsborotownship'),
  ('Cranbury Department of Public Works', 'MUNICIPAL_CENTER', 'Balloon Disposal Program', '20 Woodland Drive', 'Cranbury', 'NJ', '08512', 'US', 40.3117000, -74.5140000, '609-799-0099', ARRAY['BALLOONS'], 'jur_us_nj_middlesex_cranbury'),
  ('Plainsboro Preserve (Rush Holt Environmental Center)', 'MUNICIPAL_CENTER', 'Balloon Disposal Program', '80 Scotts Corner Road', 'Cranbury', 'NJ', '08512', 'US', 40.3021000, -74.5471000, '609-799-0099', ARRAY['BALLOONS'], 'jur_us_nj_middlesex_cranbury');
