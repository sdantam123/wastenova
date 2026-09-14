-- Middlesex County police-department medication drop-off boxes, from
-- njconsumeraffairs.gov/meddrop/pages/locations.aspx. Tagged county-wide
-- (jur_us_nj_middlesex) to match the existing pattern for county-spanning
-- programs (Paint, Tire, Cooking Oil), since any Middlesex resident can use
-- any participating police department's drop box, not just their own town's.

INSERT INTO dropoff_centers (name, center_type, program_name, address_line1, city, state, postal_code, country_code, latitude, longitude, phone, accepted_materials, jurisdiction_id)
VALUES
  ('East Brunswick Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '1 Jean Walling Civic Center Drive', 'East Brunswick', 'NJ', '08816', 'US', 40.4231000, -74.4160000, '732-390-6917', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Edison Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '100 Municipal Boulevard', 'Edison', 'NJ', '08817', 'US', 40.5187000, -74.3826000, '732-248-7400', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Milltown Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '39 Washington Avenue', 'Milltown', 'NJ', '08850', 'US', 40.4551000, -74.4390000, '732-828-1100', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Monroe Township Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '3 Municipal Plaza', 'Monroe Township', 'NJ', '08831', 'US', 40.3173479, -74.4094008, '732-521-0222', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('New Brunswick Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '25 Kirkpatrick Street', 'New Brunswick', 'NJ', '08901', 'US', 40.4841401, -74.4634318, '732-745-5200', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Old Bridge Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '1 Old Bridge Plaza', 'Old Bridge', 'NJ', '08857', 'US', 40.4034213, -74.2979160, '732-721-5600', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Perth Amboy Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '365 New Brunswick Avenue', 'Perth Amboy', 'NJ', '08861', 'US', 40.5157000, -74.2657000, '732-442-4400', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Plainsboro Township Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program (DEA Collection)', '641 Plainsboro Road', 'Plainsboro', 'NJ', '08536', 'US', 40.3222992, -74.5912869, '609-799-2333', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Sayreville Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '1000 Main Street', 'Sayreville', 'NJ', '08872', 'US', 40.4593000, -74.3610000, '732-727-4444', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('South Amboy Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '140 North Broadway', 'South Amboy', 'NJ', '08879', 'US', 40.4862000, -74.2854000, '732-721-0111', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('South Brunswick Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', 'Route 522 / Kingston Lane', 'Monmouth Junction', 'NJ', '08852', 'US', 40.3612000, -74.5507000, '732-329-4646', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('South River Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '61 Main Street', 'South River', 'NJ', '08882', 'US', 40.4487000, -74.3818000, '732-238-1000', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Spotswood Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '77 Summerhill Road', 'Spotswood', 'NJ', '08884', 'US', 40.3906000, -74.3945000, '732-251-2121', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex'),
  ('Woodbridge Police Department', 'MUNICIPAL_CENTER', 'NJ Medication Drop-Off Program', '1 Main Street', 'Woodbridge Township', 'NJ', '07095', 'US', 40.5576000, -74.2846000, '732-634-7700', ARRAY['Prescription drugs', 'OTC medication'], 'jur_us_nj_middlesex');
