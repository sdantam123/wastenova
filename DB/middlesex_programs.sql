-- Middlesex County non-physical / multi-location recycling programs:
-- paper shredding event series, medicine/syringe/battery disposal
-- networks, composting, and private transfer stations.
-- Source: Middlesex County 2026 Recycling and Solid Waste Guide.

BEGIN;

WITH new_programs AS (
  INSERT INTO recycling_programs (
    material_category, program_name, organization, program_type, accepts,
    not_accepted, how_it_works, jurisdiction_id
  ) VALUES
    (
      'Paper Shredding', 'Residential Paper Shredding Events', 'Middlesex County Solid Waste Management', 'LOCAL_EVENT',
      ARRAY['Old documents and confidential files'],
      ARRAY['Businesses', 'Batteries', 'Metal'],
      'Regional shredding events; residents may bring up to 5 file boxes or 100 lbs (no plastic bags) per car. Stay in vehicle, materials in trunk/cargo area/truck bed. Events run 9am-12pm or until the truck is filled. 2026 dates: Mar 22 (Old Bridge Recycling Center), Apr 10 (Merrill Park, Colonia), Apr 18 (Sayreville Recycling Center), May 2 (Babbage Park, North Brunswick), May 8 (Crystal Springs Waterpark, East Brunswick), Jun 7 (Papaianni Park, Edison), Jun 27 (Spotswood High School), Aug 30 (Beech Woods Park, South Brunswick), Sep 27 (Woodbridge Public Works), Oct 9 (Donaldson Park, Highland Park), Oct 17 (Cranbury School), Nov 6 (Thompson Park, Monroe). Bring a non-perishable food item to donate to REPLENISH, the Middlesex County food bank.',
      'jur_us_nj_middlesex'
    ),
    (
      'Medicine Disposal', 'Municipal Police Medicine Drop-Off', 'Middlesex County Municipal Police Departments', 'MUNICIPAL',
      NULL, NULL,
      'Many municipal police departments have a drop-off bin for medicines; no residency requirement to use a bin. Do not dispose of medications down the drain or toilet. Find nearest location: njconsumeraffairs.gov/meddrop/Pages/Locations.aspx',
      'jur_us_nj_middlesex'
    ),
    (
      'Medicine Disposal', 'DisposeMyMeds.org', 'DisposeMyMeds', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Online resource to find medication disposal programs at independent community pharmacies.', NULL
    ),
    (
      'Medicine Disposal', 'American Medicine Chest Challenge', 'Partnership for a Drug-Free New Jersey', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Partners with law enforcement to host permanent disposal bins and single-day collection events.', NULL
    ),
    (
      'Syringe Disposal', 'NJ Hospital Association Safe Syringe Program', 'New Jersey Hospital Association', 'MUNICIPAL',
      NULL, NULL,
      'Contact a participating hospital and ask for the Safe Syringe Program: St. Peter''s University Hospital, 254 Easton Avenue, New Brunswick (732-745-8600 x6010); Penn Medicine Princeton Health, 1 Plainsboro Road, Plainsboro (609-853-6140); JFK Medical Center, 65 James Street, Edison (732-321-7539); RWJ University Hospital Somerset, 110 Rehill Avenue, Somerville (908-685-2200).',
      'jur_us_nj_middlesex'
    ),
    (
      'Rechargeable Batteries', 'Call2Recycle Battery Network', 'Call2Recycle', 'RETAIL_TAKEBACK',
      ARRAY['Nickel Cadmium (Ni-Cd)', 'Nickel Metal Hydride (Ni-MH)', 'Lithium Ion (Li-ion)', 'Small Sealed Lead (Pb)', 'Button cell batteries'],
      ARRAY['Alkaline batteries (can go in regular trash)'],
      'Bag each rechargeable/button cell battery or tape terminal ends before recycling, to prevent fires. Only recycle at a drop-off location or HHW event, not curbside. Find locations: batterynetwork.org or call 1-877-2-RECYCLE.',
      NULL
    ),
    (
      'Composting', 'Backyard Compost Bin Sales', 'Middlesex County Solid Waste Management', 'MUNICIPAL',
      NULL, NULL,
      'Residents can buy compost bins for contactless pickup by appointment: Home Composter (30in high x 32in base, 17 cu ft/125 gal) $40; Geobin (30in high x 36in wide at base) $20. Call 732-745-4170.',
      'jur_us_nj_middlesex'
    ),
    (
      'Composting', 'Backyard Composting Workshops', 'Rutgers Cooperative Extension of Middlesex County', 'LOCAL_EVENT',
      NULL, NULL,
      '2026 workshop dates: Saturday April 18 at 10am, Saturday October 10 at 10am, approx. 2 hours, at the EARTH Center in Davidson''s Mill Pond Park, 42 Riva Avenue, South Brunswick. Pre-registration required: 732-745-4170 or solidwaste@co.middlesex.nj.us.',
      'jur_us_nj_middlesex'
    ),
    (
      'Bulky Waste / General Waste', 'Private Transfer Stations', 'Various Operators', 'RETAIL_TAKEBACK',
      NULL, ARRAY['Waste from vehicles over 9,000 lbs single / 16,000 lbs combined with trailer'],
      'Accepts waste from personal vehicles for a per-load fee; call ahead for days/hours/fees. Open to licensed haulers, not personal vehicles.',
      NULL
    ),
    (
      'Electronics (E-Waste)', 'Staples E-Waste Recycling', 'Staples', 'RETAIL_TAKEBACK',
      ARRAY['Printers', 'Computers', 'Computer monitors', 'Fax machines'],
      ARRAY['Televisions'],
      'Free electronics recycling at Staples stores (no televisions).',
      NULL
    ),
    (
      'Electronics (E-Waste)', 'NewTech Recycling', 'NewTech Recycling', 'RETAIL_TAKEBACK',
      ARRAY['All covered electronic devices'], NULL,
      'Accepts all NJDEP-covered electronic devices at no charge. Call 732-564-3110 to confirm before visiting.',
      NULL
    ),
    (
      'Electronics (E-Waste)', 'NJ e-Cycle Program', 'NJDEP', 'MUNICIPAL',
      NULL, NULL,
      'NJDEP maintains a list of locations that accept consumer electronics at no charge for residents of municipalities without their own program. Visit nj.gov/dep/dshw/ewaste or call 866-DEP-KNOW.',
      NULL
    )
  RETURNING id, program_name
)
SELECT id, program_name FROM new_programs;

COMMIT;
