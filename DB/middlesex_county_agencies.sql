-- Middlesex County agency contacts and the general HHW acceptance rules
-- (distinct from the specific 2026 event dates already in dropoff_centers).
-- Source: Middlesex County 2026 Recycling and Solid Waste Guide.

BEGIN;

INSERT INTO recycling_programs (
  material_category, program_name, organization, program_type, accepts, not_accepted, how_it_works, jurisdiction_id
) VALUES
  (
    'Household Hazardous Waste', 'Household Hazardous Waste (HHW) Disposal Rules', 'Middlesex County Solid Waste Management', 'LOCAL_EVENT',
    ARRAY['Aerosol cans', 'Lighter fluid', 'Antifreeze', 'Gas/oil mix', 'Household batteries (no alkaline)', 'Car batteries', 'Pesticides & herbicides', 'Gasoline', 'Latex paints', 'Photographic chemicals', 'Pool chemicals', 'Propane tanks', 'Oil-based paint', 'Drain cleaners', 'Thermometers', 'Paint thinners', 'Driveway sealer', 'Used motor oil', 'Mercury-containing items', 'Thermostats', 'Stains', 'Varnishes', 'Fluorescent light bulbs (unbroken only)', 'Fire extinguishers', 'Flares (with some exceptions)'],
    ARRAY['Tires', 'Explosives and munitions', 'Medical/infectious waste', 'Unknowns', 'Empty containers', 'Electronics', 'Appliances', 'Furniture', 'Containers over 10 gallons', 'Alkaline batteries', 'Smoke detectors'],
    'Applies at all Middlesex County HHW/E-Waste events. Residents must stay in vehicle with materials in trunk/cargo/truck bed for staff removal. No commercial vehicles. Residents bringing asbestos-containing material must pre-register by calling 732-745-4170.',
    'jur_us_nj_middlesex'
  ),
  (
    'General Recycling/Solid Waste Contact', 'Middlesex County Improvement Authority (MCIA)', 'Middlesex County Improvement Authority', 'MUNICIPAL',
    NULL, NULL,
    'Handles curbside recycling for: Cranbury, Dunellen, Helmetta, Jamesburg, Middlesex, Milltown, Monroe, New Brunswick, North Brunswick, Old Bridge, Piscataway, Plainsboro, Sayreville, South Amboy, South River, South Plainfield, and Spotswood. For missed curbside pickup in these towns, call 800-488-6242 or 609-655-5141. mciauth.com',
    'jur_us_nj_middlesex'
  ),
  (
    'General Recycling/Solid Waste Contact', 'Middlesex County Utilities Authority (MCUA)', 'Middlesex County Utilities Authority', 'MUNICIPAL',
    NULL, NULL,
    'Main Office: 732-721-3800. Landfill: 732-246-4313. mcua.com',
    'jur_us_nj_middlesex'
  ),
  (
    'General Recycling/Solid Waste Contact', 'Middlesex County Environmental Health Division', 'Middlesex County Environmental Health Division', 'MUNICIPAL',
    NULL, NULL, 'Phone: 732-745-8480.', 'jur_us_nj_middlesex'
  ),
  (
    'General Recycling/Solid Waste Contact', 'Rutgers Cooperative Extension of Middlesex County', 'Rutgers Cooperative Extension', 'MUNICIPAL',
    NULL, NULL,
    'Programs: Master Gardeners, Master Gardener Helpline, RU Ready 2 Garden Webinar Series, 4-H Youth Development Program, Environmental Stewards. Offices at the EARTH Center, 42 Riva Avenue, South Brunswick. Phone: 732-398-5262. middlesexcountynj.gov/extension',
    'jur_us_nj_middlesex'
  ),
  (
    'Food (Surplus)', 'REPLENISH Middlesex County Food Bank', 'Middlesex County', 'MUNICIPAL',
    NULL, NULL,
    'Donate unopened food and personal care items to REPLENISH, the Middlesex County food bank, to help feed residents in need. middlesexcounty.nj.gov/replenish',
    'jur_us_nj_middlesex'
  ),
  (
    'Business Recycling', 'Middlesex County Markets Directory', 'Middlesex County Solid Waste Management', 'MUNICIPAL',
    NULL, NULL,
    'Businesses whose trash hauler does not provide recycling service can use the Middlesex County Markets Directory (middlesexcountynj.gov/recycle) to locate a market for recyclables. All businesses/institutions must file an annual recycling tonnage report to their municipal recycling coordinator each March.',
    'jur_us_nj_middlesex'
  );

COMMIT;
