-- Mercer County, NJ municipal recycling programs (County, Municipal and
-- Local Programs section). MCIA HHW/Electronics is excluded here since it
-- is already represented as dropoff_centers rows (Mercer County Connection,
-- Dempster Fire Training Center events).
-- Source: "Beyond the Bucket" (Mercer County Planning Dept, Sept 2019/2020)

BEGIN;

INSERT INTO recycling_programs (
  material_category, program_name, organization, program_type, accepts,
  not_accepted, how_it_works, jurisdiction_id
) VALUES
  (
    'Electronics, Batteries, Tires, White Goods', 'East Windsor Recycling', 'East Windsor Township Public Works', 'MUNICIPAL',
    ARRAY['Computers', 'Televisions', 'Electronics', 'Car Batteries', 'Standard-size automobile tires (no rims)', 'White goods (stoves, refrigerators, washers, dryers, water heaters)', 'Cell phones'],
    ARRAY['Commercial tires'],
    'Electronics recycling Mon-Fri 7am-3pm (excl. holidays) at the Township Public Works facility, corner of Ward Street and Etra Road. White goods curbside pickup on the third Wednesday of each month for the entire Garbage District, or residents may drop off at Public Works. Cell phones can be dropped off at the Municipal Building (16 Lanning Blvd.) or the Police/Court Building (One Mile Road). Contact Public Works at 609-443-4000 ext. 215 or dpw@east-windsor.nj.us.',
    'jur_us_nj_mercer_eastwindsor'
  ),
  (
    'Bulk Waste', 'Ewing Bulk Waste', 'Ewing Township', 'MUNICIPAL',
    ARRAY['Bulk waste'],
    NULL,
    'Each Ewing address is entitled to 12 no-fee bulk waste drop-off visits per year (as of March 1, 2019) to the Convenience Center on 136 Scotch Road.',
    'jur_us_nj_mercer_ewing'
  ),
  (
    'Electronics, Tires, Batteries, Yard Waste, Metal', 'Hamilton Ecological Facility', 'Hamilton Township', 'MUNICIPAL',
    ARRAY['Televisions', 'Leaves', 'Unpainted/untreated wood', 'Junk/office mail', 'Tires (rims removed, no commercial tires)', 'Auto batteries', 'Motor oil', 'Cell phones', 'DVD/VCR players', 'Computer equipment', 'Brush', 'Newspapers', 'Cardboard', 'Grass clippings (no commercial)', 'Metal items', 'Concrete/cinder blocks/bricks'],
    ARRAY['Commercial vehicles (fee applies)'],
    'Open only to Hamilton Township residents. Items listed are accepted without fee; commercial vehicles are accepted with a fee.',
    'jur_us_nj_mercer_hamilton'
  ),
  (
    'Bulk Items', 'Hightstown Borough Bulk Pickup', 'Hightstown Borough Public Works', 'MUNICIPAL',
    ARRAY['Bulk items'],
    NULL,
    'Bulk items are collected the last Monday of each month by appointment only. Contact Public Works at 609-490-5115 to schedule.',
    'jur_us_nj_mercer_hightstownborough'
  ),
  (
    'Car Batteries, Bulk Trash, Electronics', 'Hopewell Borough Public Works Collection', 'Hopewell Borough Public Works', 'MUNICIPAL',
    ARRAY['Car batteries', 'Lawn equipment batteries', 'Bulk trash (one-day town-wide pickup, typically June, not guaranteed)', 'Electronics (same one-day event)'],
    NULL,
    'Car and lawn equipment batteries picked up by appointment only. The Borough does not otherwise collect bulk trash as part of the municipal waste contract, aside from an announced one-day town-wide bulk/electronics pickup typically scheduled each spring based on funding availability.',
    'jur_us_nj_mercer_hopewellborough'
  ),
  (
    'Electronics, Freon Appliances, Tires', 'Hopewell Township Public Works Recycling', 'Hopewell Township Public Works', 'MUNICIPAL',
    ARRAY['Camera equipment', 'Central processing units', 'Circuit boards', 'Copiers', 'Electric wire', 'Fax machines', 'Keyboards', 'Laptops/peripherals', 'Microwave ovens', 'Mouse', 'Networking equipment', 'Phones', 'Printers', 'Scanners', 'Stereo equipment', 'Televisions', 'VCRs', 'Freon appliances ($25 fee per appliance, curbside)', 'Tires ($3 under 16in, $10 over 16in, curbside)'],
    NULL,
    'Electronic recycling accepted; curbside collection of Freon appliances and tires available for the listed fees.',
    'jur_us_nj_mercer_hopewelltownship'
  ),
  (
    'Organic Waste (Composting)', 'Lawrence Township Curbside Organic Waste', 'Lawrence Township', 'MUNICIPAL',
    ARRAY['Raw food', 'Scraps', 'Cooked food', 'Meat', 'Bones', 'Paper towels', 'Pizza boxes', 'Fruit and vegetable peels', 'Litter box material', 'Coffee grounds', 'Tea bags', 'Fish', 'Egg shells', 'Egg cartons (non-Styrofoam)', 'Waxed cardboard', 'Oils', 'Fats', 'Butters', 'Brown paper bags', 'Paper take-out containers', 'Newspapers', 'Office paper', 'Fruit and nuts', 'Breads', 'Pasta', 'Grains', 'Liquids and sauces', 'Houseplants and flower bouquets', 'Dairy products'],
    NULL,
    'Subscription program: $38.50/month. Residents receive a 32-gallon recycle cart for organic waste, delivered to local farms for composting.',
    'jur_us_nj_mercer_lawrencetownship'
  ),
  (
    'Plastics, Batteries, Electronics, Corks', 'Pennington Farmers Market Recycling Tent', 'Hopewell Valley Green Team', 'LOCAL_EVENT',
    ARRAY['#5 plastic containers (clean & whole)', 'Brita & Pur water filters', 'Styrofoam egg cartons', 'CDs/DVDs', 'Wine bottle corks (not synthetic)', 'Oral care product packages', 'Button/cell batteries'],
    NULL,
    'Once a month the Hopewell Valley Green Team collects these items at the Pennington Farmers Market to be recycled or upcycled.',
    'jur_us_nj_mercer_penningtonborough'
  ),
  (
    'Bulk Items, Electronics, White Goods', 'Pennington Borough Sticker Program', 'Pennington Borough', 'MUNICIPAL',
    ARRAY['Tires (1 sticker)', 'Computers (3 stickers)', 'Televisions (3-5 stickers depending on size)', 'Washers (5 stickers)', 'Dryers (4 stickers)', 'Refrigerators/freezers/dehumidifiers/air conditioners (8 stickers)'],
    NULL,
    'Stickers purchased at Pennington Borough Hall are placed on bulk items, each sticker covers about 40 pounds. Once stickered, items are cleared for pickup with regular trash on your scheduled day.',
    'jur_us_nj_mercer_penningtonborough'
  ),
  (
    'Batteries, Styrofoam, Electronics, Corks, Pill Bottles', 'Princeton Farmers Market Recycling Tent', 'Sustainable Princeton', 'LOCAL_EVENT',
    ARRAY['Batteries', 'Block Styrofoam and packing peanuts (sealed bag)', 'Cell phones/tablets', 'Printer cartridges', 'Pill bottles (labels removed)', 'Wine corks'],
    NULL,
    'Once a month Sustainable Princeton collects these items at the Princeton Farmers Market to be recycled or upcycled. Open Thursdays from May to November, 10am-3pm.',
    'jur_us_nj_mercer_princeton'
  ),
  (
    'Batteries, Electronics, Tires', 'Robbinsville Township Public Works Recycling', 'Robbinsville Township Public Works', 'MUNICIPAL',
    ARRAY['Car/boat/wet cell batteries', 'Rechargeable batteries (Ni-Cd, Ni-MH, Li-ion, Ni-Zn, SSLA-PB: watch, cell phone, power tool, camera batteries)', 'Computers/printers/monitors/computer accessories', 'Tires (must be off the rim)'],
    NULL,
    'Car/boat/wet cell batteries and tires drop off at Public Works only. Rechargeable batteries also accepted at the Senior Center. Computer equipment pickup available the last Wednesday of each month by calling 609-259-0422, or drop off at Public Works.',
    'jur_us_nj_mercer_robbinsvilletownship'
  ),
  (
    'Electronics', 'West Windsor Dumpster Day', 'West Windsor Township', 'MUNICIPAL',
    ARRAY['Electronics'],
    NULL,
    'Electronics can be recycled at West Windsor Dumpster Day events.',
    'jur_us_nj_mercer_westwindsor'
  ),
  (
    'Bulk Items', 'Trenton City Bulk Pickup', 'Trenton City Public Works Department, Division of Solid Waste Management', 'MUNICIPAL',
    ARRAY['Furniture', 'Household appliances'],
    NULL,
    'Special pickup for large bulk items by appointment. Call 609-989-3175, Monday-Friday, 7:30am-3:30pm.',
    'jur_us_nj_mercer_trenton'
  );

COMMIT;
