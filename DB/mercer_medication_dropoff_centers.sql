-- Mercer County police-department medication drop-off boxes, from
-- njconsumeraffairs.gov/meddrop/pages/locations.aspx. Tagged county-wide
-- (jur_us_nj_mercer) matching the Middlesex County medication drop-off
-- pattern, since any Mercer resident can use any participating police
-- department's drop box, not just their own town's.

INSERT INTO dropoff_centers (name, center_type, program_name, address_line1, city, state, postal_code, country_code, latitude, longitude, phone, accepted_materials, jurisdiction_id)
VALUES
  ('Ewing Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '2 Jake Garzio Drive', 'Ewing', 'NJ', '08628', 'US', 40.2732000, -74.7896000, '609-882-1313', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Hamilton Township Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '1270 Whitehorse-Mercerville Road', 'Hamilton', 'NJ', '08619', 'US', 40.2298000, -74.6524000, '609-581-4045', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Hightstown Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '415A Mercer Street', 'Hightstown', 'NJ', '08520', 'US', 40.2698000, -74.5232000, '609-448-1234', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Hopewell Township Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '201 Washington Crossing Pennington Road', 'Titusville', 'NJ', '08560', 'US', 40.3079000, -74.8368000, '609-737-3100', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Lawrence Township Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '2211 Lawrenceville Road', 'Lawrenceville', 'NJ', '08648', 'US', 40.2965000, -74.7288000, '609-896-0225', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Mercer County Sheriff''s Office', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '640 South Broad Street', 'Trenton', 'NJ', '08611', 'US', 40.2098000, -74.7654000, '609-989-6111', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Princeton Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '1 Valley Road', 'Princeton', 'NJ', '08540', 'US', 40.3573000, -74.6672000, '609-927-2100', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Princeton University Department of Public Safety', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '200 Elm Drive', 'Princeton', 'NJ', '08544', 'US', 40.3444000, -74.6570000, '609-258-1000', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Robbinsville Township Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '1117 U.S. 130', 'Robbinsville', 'NJ', '08691', 'US', 40.2143000, -74.6062000, '609-259-3900', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('The College of New Jersey Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '2000 Pennington Road', 'Ewing Township', 'NJ', '08618', 'US', 40.2939000, -74.7826000, '609-771-2345', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('Trenton Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '225 N. Clinton Avenue', 'Trenton', 'NJ', '08618', 'US', 40.2231000, -74.7546000, '609-989-4055', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer'),
  ('West Windsor Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '20 Municipal Drive', 'West Windsor', 'NJ', '08550', 'US', 40.2757000, -74.6135000, '609-799-1222', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_mercer');
