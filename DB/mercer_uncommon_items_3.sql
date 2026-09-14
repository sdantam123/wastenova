-- Mercer County "Beyond the Bucket" uncommon items guide, batch 3 of N
-- (pages 16-20: Packing Materials through Wire Clothes Hangers).
-- Source: Beyond the Bucket (Mercer County Planning Dept, Sept 2019/2020)

BEGIN;

WITH new_programs AS (
  INSERT INTO recycling_programs (
    material_category, program_name, organization, program_type, accepts,
    not_accepted, how_it_works, incentive
  ) VALUES
    ('Packing Materials', 'UPS Packing Material Reuse', 'UPS', 'RETAIL_TAKEBACK',
      ARRAY['Clean packing peanuts', 'Bubble wrap'], NULL, 'Accepts clean packing peanuts and bubble wrap to reuse or recycle. Locations in Mercer County: Southfield Shopping Center, Princeton Shopping Center, Hopewell Crossing Shopping Center, Hamilton Marketplace, Lawrence Shopping Center, 174 Nassau St., Princeton.', NULL),
    ('Packing Materials', 'Princeton Farmers Market Recycling Tent', 'Sustainable Princeton', 'LOCAL_EVENT',
      ARRAY['Block Styrofoam and packing peanuts (sealed bag)'], NULL, 'Once a month Sustainable Princeton collects items at the Princeton Farmers Market. Open Thursdays from May to November, 10am-3pm.', NULL),

    ('Performance Nutrition', 'TerraCycle: GU Energy Lab', 'TerraCycle', 'MAIL_IN',
      ARRAY['Energy chew packets', 'Energy gel packets', 'Hydration drink mix stick packs', 'Recovery drink mix & GU Roctane Energy Drink Mix pouches', 'Energy Stroopwafel wrappers'],
      NULL, 'Free mail-in program.', NULL),

    ('Plastic Bags (Grocery, Produce, Snack, etc)', 'Wrap Recycling Action Program', 'Various Retailers', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Various stores have collection bins for plastic bags. Locations in Mercer County: East Windsor (Kohl''s, Target, Wal-Mart), Hamilton (Kohl''s, Wal-Mart), Lawrence (Acme, JCPenny), Pennington (ShopRite), Princeton (McCaffrey''s, Whole Earth Center), Trenton (Acme), West Windsor (Lowe''s, McCaffrey''s, Target, Wal-Mart, Wegmans, Whole Foods Market).', NULL),

    ('Plastic #5', 'Preserve Gimme5', 'Preserve', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Preserve sorts, washes, melts, pelletizes and tests recycled plastic into raw materials to create new Preserve products. Location in Mercer County: Whole Foods, West Windsor.', NULL),

    ('Plastic #6', 'TerraCycle: #6 Rigid Plastic Cups', 'TerraCycle', 'MAIL_IN',
      ARRAY['#6 rigid plastic cups (such as Solo cups)'], NULL, 'Free mail-in program.', NULL),

    ('Prescription Drugs', 'New Jersey Medical Drop-Off', 'New Jersey Medical Drop-Off / Local Police Departments', 'MUNICIPAL',
      NULL, ARRAY['Syringes', 'Liquid medication'], 'Consumers from anywhere in New Jersey can visit drop boxes seven days a week to dispose of unneeded and expired medications. Locations: police headquarters in each town.', NULL),
    ('Prescription Drugs', 'Princeton Farmers Market Recycling Tent', 'Sustainable Princeton', 'LOCAL_EVENT',
      ARRAY['Clean and empty pill bottles minus labels'], NULL, 'Once a month Sustainable Princeton collects items at the Princeton Farmers Market. Open Thursdays from May to November, 10am-3pm.', NULL),

    ('Razors', 'TerraCycle: Gillette', 'TerraCycle', 'MAIL_IN',
      ARRAY['All brands of blades and razors (systems and disposable units, replaceable-blade cartridge units)', 'Rigid plastic packaging', 'Flexible plastic bag packaging'],
      NULL, 'Free mail-in program.', NULL),

    ('Shoes', 'Crocs Donation Program', 'Crocs', 'MAIL_IN',
      NULL, NULL, 'Send in gently used Crocs; given to someone in need.', NULL),
    ('Shoes', 'Nike Reuse-A-Shoe', 'Nike', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Return any brand of athletic shoes to Nike; materials reused to make Nike Grind. Locations in New Jersey: Jackson Premium Outlets, The Outlets at Bergen Town Center, The Mills at Jersey Gardens, Gloucester Premium Outlets, Jersey Shore Premium Outlets, Tanger Outlets Atlantic City, Newark.', NULL),
    ('Shoes', 'Levi Strauss & Co Take Back', 'Levi Strauss & Co', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring any brand of clothes and shoes to a Levi Strauss store; re-worn, repurposed, or recycled. Location in New Jersey: Jackson Premium Outlets, Jersey Shore Premium Outlets, Gloucester Premium Outlets, The Mills of Jersey Gardens, Tanger Outlets in Atlantic City.', '20% off single item'),
    ('Shoes', 'The North Face Clothes the Loop', 'The North Face', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring any brand of clothes/shoes to a store; sent to Shoes4Souls nonprofit. Locations in New Jersey: Cherry Hill Mall, Westfield Garden State Plaza.', '$10 voucher toward $100+ purchase'),

    ('Snack Bag', 'TerraCycle: Snack Bags', 'TerraCycle', 'MAIL_IN',
      ARRAY['Family-size snack bags', 'Individual snack bags', 'Multipack snack bags'], NULL, 'Free mail-in program.', NULL),
    ('Snack Bag', 'TerraCycle: Entenmann''s', 'TerraCycle', 'MAIL_IN',
      ARRAY['Entenmann''s Little Bites and Little Bites minis wrappers'], NULL, 'Free mail-in program.', NULL),
    ('Snack Bag', 'TerraCycle: Late July', 'TerraCycle', 'MAIL_IN',
      ARRAY['Late July product bags'], NULL, 'Free mail-in program.', NULL),
    ('Snack Bag', 'TerraCycle: Calbee', 'TerraCycle', 'MAIL_IN',
      ARRAY['All Calbee flexible packaging'], NULL, 'Free mail-in program.', NULL),

    ('Sports Equipment', 'USA Soccer Federation Equipment Donation', 'USA Soccer Federation', 'MAIL_IN',
      NULL, NULL, 'Collects gently used soccer equipment and redistributes it throughout the United States; donor responsible for shipping/delivery cost.', NULL),
    ('Sports Equipment', 'Pitch In For Baseball', 'Pitch In For Baseball', 'MAIL_IN',
      ARRAY['Baseballs', 'Gloves (RH/LH) 11 inch or larger', 'BBCOR and USA Baseball standard bats', 'Catcher''s gear'],
      NULL, 'About 60% of equipment available to give to groups in need comes from volunteer-collected gear around the US and Canada each year.', NULL),
    ('Sports Equipment', 'Rebounce Tennis Ball Recycling', 'Rebounce', 'MAIL_IN',
      NULL, NULL, 'Tennis balls ground up and incorporated as a component in tennis court construction and resurfacing. Provides shipping label, accepts any amount.', NULL),

    ('Squeeze Pouches', 'TerraCycle: GoGo Squeez', 'TerraCycle', 'MAIL_IN',
      ARRAY['Healthy snack plastic pouches and caps'], NULL, 'Free mail-in program.', NULL),

    ('Televisions', 'Best Buy Electronics Recycling', 'Best Buy', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Recycles a wide range of electronic equipment. If large appliances (TVs, dishwashers, dryers) can''t be brought in, Best Buy will remove the item for a fee when delivering a new product. Location in Mercer County: Nassau Park Pavilion, West Windsor.', NULL),
    ('Televisions', 'Monmouth Recycling Television Recycling', 'Monmouth Recycling', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Older televisions (not flat screens) accepted at 50 cents a pound; all others accepted for free. Location: 3250 Shafto Road, Tinton Falls, NJ.', NULL),
    ('Televisions', 'Staples Tech Trade-In', 'Staples', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Tech Trade-In: get Staples cash for wanted devices; unwanted devices recycled. Locations in Mercer County: Hamilton Marketplace; Lawrence Shopping Center; Shops at Windsor Green (West Windsor); Route 130 South, East Windsor.', 'Staples cash'),

    ('Toys', 'TerraCycle: Lol Surprise', 'TerraCycle', 'MAIL_IN',
      ARRAY['All L.O.L. Surprise! packaging, accessories and products'], NULL, 'Free mail-in program.', NULL),
    ('Toys', 'TerraCycle: Hasbro Toys', 'TerraCycle', 'MAIL_IN',
      ARRAY['All Hasbro toys and games'],
      ARRAY['Batteries', 'Juvenile products (playpens, car seats, high chairs, swings, bouncy seats, etc.)', 'Ride-on products (bicycles, tricycles, scooters, skateboards, etc.)'],
      'Free mail-in program.', NULL),
    ('Toys', 'Second Chance Toys', 'Second Chance Toys', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Putting clean plastic toys in the hands of disadvantaged children. Closest location: Montgomery Township Recycling, 12 Harlingen Road, Belle Mead, NJ 08502 (limited drop-off hours).', NULL),

    ('VHS Tapes', 'Monmouth Recycling VHS Recycling', 'Monmouth Recycling', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Accepts VHS tapes/cassettes to be recycled at 50 cents a pound. Location: 3250 Shafto Road, Tinton Falls, NJ.', NULL),

    ('Wine Corks (natural, not synthetic)', 'Princeton Farmers Market Recycling Tent', 'Sustainable Princeton', 'LOCAL_EVENT',
      ARRAY['Wine corks'], NULL, 'Once a month Sustainable Princeton collects items at the Princeton Farmers Market. Open Thursdays from May to November, 10am-3pm.', NULL),
    ('Wine Corks (natural, not synthetic)', 'Whole Foods Cork Donation Box', 'Whole Foods', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Cork donation box. Location: Windsor Green Shopping Center.', NULL),
    ('Wine Corks (natural, not synthetic)', 'Recork', 'Recork', 'MAIL_IN',
      NULL, NULL, 'Must be a package of 15 pounds (1,500 corks) or heavier for corks to be accepted.', NULL),

    ('Wire Clothes Hangers', 'Dry Cleaner Hanger Take-Back', 'Local Dry Cleaners', 'RETAIL_TAKEBACK',
      NULL, ARRAY['Paper, plastic, foam and cardboard must be removed'], 'Most dry cleaners will accept donations of wire hangers with the paper, plastic, foam and cardboard removed.', NULL)
  RETURNING id
)
SELECT count(*) FROM new_programs;

COMMIT;
