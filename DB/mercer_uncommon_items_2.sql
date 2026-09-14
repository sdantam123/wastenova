-- Mercer County "Beyond the Bucket" uncommon items guide, batch 2 of N
-- (pages 13-15: Furniture through Medical Equipment).
-- Source: Beyond the Bucket (Mercer County Planning Dept, Sept 2019/2020)

BEGIN;

WITH new_programs AS (
  INSERT INTO recycling_programs (
    material_category, program_name, organization, program_type, accepts,
    not_accepted, how_it_works, incentive
  ) VALUES
    ('Furniture', 'HomeFront Furnish the Future', 'HomeFront', 'MAIL_IN',
      ARRAY['Bunkbeds (frames, small parts taped and bagged)', 'Dressers (small and medium sized)', 'Small sofas', 'Love-seats', 'Dinette tables and chairs', 'End tables and coffee tables', 'Bookcases'],
      NULL, 'HomeFront''s mission is to end homelessness in Central New Jersey. Furnish the Future helps over 500 families a year. Location: 1880 Princeton Ave., Lawrenceville, NJ 08648.', NULL),
    ('Furniture', 'Habitat for Humanity ReStore', 'Habitat for Humanity', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Independently owned reuse stores that accept furniture donations and sell home improvement items at a fraction of retail price. Closest location: Langhorne ReStore of Bucks County HFH, 1337 E. Lincoln Highway, Langhorne, PA 19056.', NULL),

    ('Gardening Equipment', 'Lowe''s Gardening Take-Back', 'Lowe''s', 'RETAIL_TAKEBACK',
      ARRAY['Plant pots, trays, and tags', 'CFL bulbs', 'Rechargeable batteries'], NULL, 'Turn in plant pots, trays and tags at any Lowe''s. Locations in Mercer County: Hamilton Marketplace; Route 1 North, West Windsor.', NULL),

    ('Greeting Cards', 'Saint Jude''s Children''s Hospital Card Recycling', 'St. Jude''s Ranch for Children', 'MAIL_IN',
      NULL, ARRAY['Hallmark cards', 'American Greetings cards', 'Disney cards'], 'Takes used donated cards and makes them into new ones; resold with proceeds supporting the mission.', NULL),

    ('Hearing Aids', 'Starkey Hearing Foundation', 'Starkey Hearing Foundation', 'MAIL_IN',
      NULL, NULL, 'Donate old hearing aids in any condition; donation is tax deductible.', NULL),

    ('Holiday Lights', 'Holiday LEDs Recycling', 'Holiday LEDs', 'MAIL_IN',
      NULL, NULL, 'Send in old holiday lights.', '20% off next purchase'),

    ('Home Appliances', 'Habitat for Humanity ReStore', 'Habitat for Humanity', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Independently owned reuse stores that accept home appliance donations. Closest location: Langhorne ReStore of Bucks County HFH, 1337 E. Lincoln Highway, Langhorne, PA 19056.', NULL),
    ('Home Appliances', 'HomeFront Kitchenware Donation', 'HomeFront', 'MAIL_IN',
      ARRAY['Kitchenware (dishes, pots, pans, etc.)', 'Small appliances'], NULL, 'Location: 1880 Princeton Ave., Lawrenceville, NJ 08648.', NULL),

    ('Ink/Toner Cartridges', 'Best Buy Ink and Toner Recycling', 'Best Buy', 'RETAIL_TAKEBACK',
      NULL, NULL, 'For every cartridge brought in, receive $2 on next ink purchase of $40+ or toner purchase of $100+ (up to $10). Location in Mercer County: Nassau Park Pavilion, West Windsor.', '$2 per cartridge (up to $10)'),
    ('Ink/Toner Cartridges', 'Staples Ink/Toner Recycling', 'Staples', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Recycles rechargeable batteries, old tech, and ink/toner for free. Locations in Mercer County: Hamilton Marketplace; Lawrence Shopping Center; Shops at Windsor Green (West Windsor); Route 130 South, East Windsor.', NULL),
    ('Ink/Toner Cartridges', 'Target Ink Cartridge Kiosk', 'Target', 'RETAIL_TAKEBACK',
      NULL, NULL, 'In-store kiosks for MP3 players, cellphones, and ink cartridges. Locations in Mercer County: Nassau Park Pavilion, West Windsor; East Windsor Village.', NULL),

    ('Linens', 'HomeFront Linen Donation', 'HomeFront', 'MAIL_IN',
      ARRAY['Bed sheets (twin, full, queen)', 'Towels without holes or stains'], NULL, 'Location: 1880 Princeton Ave., Lawrenceville, NJ 08648.', NULL),
    ('Linens', 'Animal Shelter Linen Donation', 'Local Animal Shelters', 'RETAIL_TAKEBACK',
      ARRAY['Sheets', 'Quilts', 'Duvets', 'Towels'], NULL, 'Animal shelters generally accept sheets, quilts, duvets, and towels. Locations in Mercer County: EASEL Animal Rescue, Ewing; Hamilton Township Animal Shelter; Trenton Animal Shelter.', NULL),

    ('Mattresses', 'CJP Group Mattress Recycling', 'CJP Group', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Call to arrange for mattress pick up; used to make housing insulation. $10 per piece when dropped off. Call 732-620-9787 for more information.', NULL),
    ('Mattresses', 'HomeFront Mattress Donation', 'HomeFront', 'MAIL_IN',
      ARRAY['Queen, full and twin size mattresses with box springs and frames in good condition (without holes or stains)'], NULL, 'Location: 1880 Princeton Ave., Lawrenceville, NJ 08648.', NULL),

    ('Medical Equipment', 'Back In Action Medical Equipment Exchange', 'Back In Action', 'MAIL_IN',
      NULL, NULL, 'Can post different medical equipment to either donate or sell throughout New Jersey. Location depends on who needs the product.', NULL),
    ('Medical Equipment', 'Goodwill HomeMedical', 'Goodwill', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Donation service; medical equipment donated to someone who needs it. Tax deductible. Location: 300 Benigno Blvd., Bellmawr, NJ.', NULL),
    ('Medical Equipment', 'Princeton Farmers Market Recycling Tent', 'Sustainable Princeton', 'LOCAL_EVENT',
      ARRAY['Pill bottles'], NULL, 'Once a month Sustainable Princeton collects items at the Princeton Farmers Market. Open Thursdays from May to November, 10am-3pm.', NULL)
  RETURNING id
)
SELECT count(*) FROM new_programs;

COMMIT;
