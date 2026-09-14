-- Structured location rows for recycling_programs whose how_it_works text
-- lists specific store/mall names. Extracted from "Beyond the Bucket"
-- (Mercer County Planning Dept, Sept 2019/2020). Mercer County locations
-- get city/state where the source specified a town; multi-county NJ mall
-- lists get state='NJ' with city left NULL unless named.

BEGIN;

INSERT INTO program_locations (program_id, location_name, address_line1, city, state, postal_code, notes) VALUES
  -- 39: Habitat for Humanity ReStore (Building Supplies)
  (39, 'Langhorne ReStore of Bucks County HFH', '1337 E. Lincoln Highway', 'Langhorne', 'PA', '19056', NULL),
  -- 41: Dress for Success
  (41, 'Dress for Success Mercer County', '3131 Princeton Pike, Building 4, Suite 209', NULL, 'NJ', NULL, NULL),
  -- 42: Career Gear
  (42, 'Career Gear', '125 Maiden Lane 3B', 'New York', 'NY', NULL, NULL),
  -- 46: Apple Trade In / Recycling (Cellphones)
  (46, 'Apple Store - Quaker Bridge Mall', NULL, NULL, 'NJ', NULL, 'Quaker Bridge Mall'),
  -- 49: Target Electronics Trade-In (Cellphones)
  (49, 'Target - Nassau Park Pavilion', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (49, 'Target - East Windsor Village', NULL, 'East Windsor', 'NJ', NULL, NULL),
  -- 50: Verizon Wireless Device Recycling
  (50, 'Verizon - Hamilton Marketplace', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (50, 'Verizon - 950 Route 33', '950 Route 33', 'Hamilton', 'NJ', NULL, NULL),
  (50, 'Verizon - Mercer Mall', NULL, NULL, 'NJ', NULL, NULL),
  (50, 'Verizon - 200 Campus Town Center', '200 Campus Town Center', 'Ewing', 'NJ', NULL, NULL),
  (50, 'Verizon - Quaker Bridge Mall', NULL, NULL, 'NJ', NULL, NULL),
  (50, 'Verizon - Princeton Shopping Center', NULL, 'Princeton', 'NJ', NULL, NULL),
  -- 53: American Eagle Jean Recycling
  (53, 'American Eagle - Quaker Bridge Mall', NULL, NULL, 'NJ', NULL, NULL),
  -- 54: & Other Stories Clothing Recycling
  (54, '& Other Stories', NULL, 'New York', 'NY', NULL, 'Closest location'),
  -- 55: Eileen Fisher Take Back
  (55, 'Eileen Fisher - Secaucus', '45 Enterprise Ave. N.', 'Secaucus', 'NJ', NULL, NULL),
  (55, 'Eileen Fisher - Short Hills Mall', NULL, NULL, 'NJ', NULL, NULL),
  -- 57: Levi Strauss & Co Take Back (Clothing)
  (57, 'Levi Strauss - Jackson Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (57, 'Levi Strauss - Jersey Shore Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (57, 'Levi Strauss - Gloucester Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (57, 'Levi Strauss - The Mills at Jersey Gardens', NULL, NULL, 'NJ', NULL, NULL),
  (57, 'Levi Strauss - Tanger Outlets Atlantic City', NULL, 'Atlantic City', 'NJ', NULL, NULL),
  -- 58: Madewell Jean Recycling
  (58, 'Madewell - Bridgewater Commons', NULL, NULL, 'NJ', NULL, NULL),
  (58, 'Madewell - The Grove West', NULL, NULL, 'NJ', NULL, NULL),
  (58, 'Madewell - Westfield Garden State Plaza', NULL, NULL, 'NJ', NULL, NULL),
  (58, 'Madewell - The Mall at Short Hills', NULL, NULL, 'NJ', NULL, NULL),
  (58, 'Madewell - Tice''s Corner Marketplace', NULL, NULL, 'NJ', NULL, NULL),
  -- 59: The North Face Clothes the Loop (Clothing)
  (59, 'The North Face - Cherry Hill Mall', NULL, NULL, 'NJ', NULL, NULL),
  (59, 'The North Face - Westfield Garden State Plaza', NULL, NULL, 'NJ', NULL, NULL),
  -- 60: Patagonia Worn Wear
  (60, 'Patagonia', '72 Greene St.', 'New York', 'NY', NULL, 'Closest location'),
  -- 61: Rag & Bone Denim Recycling
  (61, 'Rag & Bone', '182A Columbus Ave.', 'New York', 'NY', NULL, 'Closest location'),
  -- 64: Monmouth Recycling CD Recycling
  (64, 'Monmouth Recycling', NULL, 'Tinton Falls', 'NJ', NULL, NULL),
  -- 67: Apple Trade In / Recycling (Computers)
  (67, 'Apple Store - Quaker Bridge Mall', NULL, NULL, 'NJ', NULL, NULL),
  -- 68: Best Buy Computer Recycling
  (68, 'Best Buy - Nassau Park Pavilion', NULL, 'West Windsor', 'NJ', NULL, NULL),
  -- 69: Staples Tech Trade-In (Computers)
  (69, 'Staples - Hamilton Marketplace', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (69, 'Staples - Lawrence Shopping Center', NULL, 'Lawrence Township', 'NJ', NULL, NULL),
  (69, 'Staples - Shops at Windsor Green', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (69, 'Staples - Route 130 South', 'Route 130 South', 'East Windsor', 'NJ', NULL, NULL),
  -- 70: Target Electronics Trade-In (Computers)
  (70, 'Target - Nassau Park Pavilion', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (70, 'Target - East Windsor Village', NULL, 'East Windsor', 'NJ', NULL, NULL),
  -- 78: New Jersey Lions Club Eyeglass Recycling
  (78, 'Pennington Quality Market', NULL, 'Hopewell Valley', 'NJ', NULL, NULL),
  (78, 'Stony Brook Elementary School', NULL, 'Hopewell Valley', 'NJ', NULL, NULL),
  (78, 'Pennington Presbyterian Church', NULL, 'Hopewell Valley', 'NJ', NULL, NULL),
  (78, 'Vision Center at Wal-Mart', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (78, 'McCaffrey''s Supermarket', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (78, 'West Windsor Library', NULL, 'West Windsor', 'NJ', NULL, NULL),
  -- 84: Becca's Closet
  (84, 'Becca''s Closet', '400 Jefferson St.', 'Hackettstown', 'NJ', NULL, NULL),
  -- 89: HomeFront Furnish the Future (Furniture)
  (89, 'HomeFront', '1880 Princeton Ave.', 'Lawrenceville', 'NJ', '08648', NULL),
  -- 90: Habitat for Humanity ReStore (Furniture)
  (90, 'Langhorne ReStore of Bucks County HFH', '1337 E. Lincoln Highway', 'Langhorne', 'PA', '19056', NULL),
  -- 91: Lowe's Gardening Take-Back
  (91, 'Lowe''s - Hamilton Marketplace', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (91, 'Lowe''s - Route 1 North', 'Route 1 North', 'West Windsor', 'NJ', NULL, NULL),
  -- 95: Habitat for Humanity ReStore (Home Appliances)
  (95, 'Langhorne ReStore of Bucks County HFH', '1337 E. Lincoln Highway', 'Langhorne', 'PA', '19056', NULL),
  -- 96: HomeFront Kitchenware Donation
  (96, 'HomeFront', '1880 Princeton Ave.', 'Lawrenceville', 'NJ', '08648', NULL),
  -- 97: Best Buy Ink and Toner Recycling
  (97, 'Best Buy - Nassau Park Pavilion', NULL, 'West Windsor', 'NJ', NULL, NULL),
  -- 98: Staples Ink/Toner Recycling
  (98, 'Staples - Hamilton Marketplace', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (98, 'Staples - Lawrence Shopping Center', NULL, 'Lawrence Township', 'NJ', NULL, NULL),
  (98, 'Staples - Shops at Windsor Green', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (98, 'Staples - Route 130 South', 'Route 130 South', 'East Windsor', 'NJ', NULL, NULL),
  -- 99: Target Ink Cartridge Kiosk
  (99, 'Target - Nassau Park Pavilion', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (99, 'Target - East Windsor Village', NULL, 'East Windsor', 'NJ', NULL, NULL),
  -- 100: HomeFront Linen Donation
  (100, 'HomeFront', '1880 Princeton Ave.', 'Lawrenceville', 'NJ', '08648', NULL),
  -- 101: Animal Shelter Linen Donation
  (101, 'EASEL Animal Rescue', NULL, 'Ewing', 'NJ', NULL, NULL),
  (101, 'Hamilton Township Animal Shelter', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (101, 'Trenton Animal Shelter', NULL, 'Trenton', 'NJ', NULL, NULL),
  -- 103: HomeFront Mattress Donation
  (103, 'HomeFront', '1880 Princeton Ave.', 'Lawrenceville', 'NJ', '08648', NULL),
  -- 105: Goodwill HomeMedical
  (105, 'Goodwill HomeMedical', '300 Benigno Blvd.', 'Bellmawr', 'NJ', NULL, NULL),
  -- 107: UPS Packing Material Reuse
  (107, 'UPS - Southfield Shopping Center', NULL, NULL, 'NJ', NULL, NULL),
  (107, 'UPS - Princeton Shopping Center', NULL, 'Princeton', 'NJ', NULL, NULL),
  (107, 'UPS - Hopewell Crossing Shopping Center', NULL, NULL, 'NJ', NULL, NULL),
  (107, 'UPS - Hamilton Marketplace', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (107, 'UPS - Lawrence Shopping Center', NULL, 'Lawrence Township', 'NJ', NULL, NULL),
  (107, 'UPS - 174 Nassau St.', '174 Nassau St.', 'Princeton', 'NJ', NULL, NULL),
  -- 110: Wrap Recycling Action Program
  (110, 'Kohl''s - East Windsor', NULL, 'East Windsor', 'NJ', NULL, NULL),
  (110, 'Target - East Windsor', NULL, 'East Windsor', 'NJ', NULL, NULL),
  (110, 'Wal-Mart - East Windsor', NULL, 'East Windsor', 'NJ', NULL, NULL),
  (110, 'Kohl''s - Hamilton', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (110, 'Wal-Mart - Hamilton', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (110, 'Acme - Lawrence', NULL, 'Lawrence Township', 'NJ', NULL, NULL),
  (110, 'JCPenny - Lawrence', NULL, 'Lawrence Township', 'NJ', NULL, NULL),
  (110, 'ShopRite - Pennington', NULL, 'Pennington', 'NJ', NULL, NULL),
  (110, 'McCaffrey''s - Princeton', NULL, 'Princeton', 'NJ', NULL, NULL),
  (110, 'Whole Earth Center - Princeton', NULL, 'Princeton', 'NJ', NULL, NULL),
  (110, 'Acme - Trenton', NULL, 'Trenton', 'NJ', NULL, NULL),
  (110, 'Lowe''s - West Windsor', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (110, 'McCaffrey''s - West Windsor', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (110, 'Target - West Windsor', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (110, 'Wal-Mart - West Windsor', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (110, 'Wegmans - West Windsor', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (110, 'Whole Foods Market - West Windsor', NULL, 'West Windsor', 'NJ', NULL, NULL),
  -- 111: Preserve Gimme5
  (111, 'Whole Foods', NULL, 'West Windsor', 'NJ', NULL, NULL),
  -- 113: New Jersey Medical Drop-Off
  (113, 'Local Police Headquarters', NULL, NULL, 'NJ', NULL, 'Available at police headquarters in each NJ town'),
  -- 117: Nike Reuse-A-Shoe
  (117, 'Nike - Jackson Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (117, 'Nike - The Outlets at Bergen Town Center', NULL, NULL, 'NJ', NULL, NULL),
  (117, 'Nike - The Mills at Jersey Gardens', NULL, NULL, 'NJ', NULL, NULL),
  (117, 'Nike - Gloucester Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (117, 'Nike - Jersey Shore Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (117, 'Nike - Tanger Outlets Atlantic City', NULL, 'Atlantic City', 'NJ', NULL, NULL),
  (117, 'Nike - Newark', NULL, 'Newark', 'NJ', NULL, NULL),
  -- 118: Levi Strauss & Co Take Back (Shoes)
  (118, 'Levi Strauss - Jackson Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (118, 'Levi Strauss - Jersey Shore Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (118, 'Levi Strauss - Gloucester Premium Outlets', NULL, NULL, 'NJ', NULL, NULL),
  (118, 'Levi Strauss - The Mills of Jersey Gardens', NULL, NULL, 'NJ', NULL, NULL),
  (118, 'Levi Strauss - Tanger Outlets Atlantic City', NULL, 'Atlantic City', 'NJ', NULL, NULL),
  -- 119: The North Face Clothes the Loop (Shoes)
  (119, 'The North Face - Cherry Hill Mall', NULL, NULL, 'NJ', NULL, NULL),
  (119, 'The North Face - Westfield Garden State Plaza', NULL, NULL, 'NJ', NULL, NULL),
  -- 128: Best Buy Electronics Recycling
  (128, 'Best Buy - Nassau Park Pavilion', NULL, 'West Windsor', 'NJ', NULL, NULL),
  -- 129: Monmouth Recycling Television Recycling
  (129, 'Monmouth Recycling', '3250 Shafto Road', 'Tinton Falls', 'NJ', NULL, NULL),
  -- 130: Staples Tech Trade-In (Televisions)
  (130, 'Staples - Hamilton Marketplace', NULL, 'Hamilton', 'NJ', NULL, NULL),
  (130, 'Staples - Lawrence Shopping Center', NULL, 'Lawrence Township', 'NJ', NULL, NULL),
  (130, 'Staples - Shops at Windsor Green', NULL, 'West Windsor', 'NJ', NULL, NULL),
  (130, 'Staples - Route 130 South', 'Route 130 South', 'East Windsor', 'NJ', NULL, NULL),
  -- 133: Second Chance Toys
  (133, 'Montgomery Township Recycling', '12 Harlingen Road', 'Belle Mead', 'NJ', '08502', 'Limited drop-off hours'),
  -- 134: Monmouth Recycling VHS Recycling
  (134, 'Monmouth Recycling', '3250 Shafto Road', 'Tinton Falls', 'NJ', NULL, NULL),
  -- 136: Whole Foods Cork Donation Box
  (136, 'Whole Foods', NULL, NULL, 'NJ', NULL, 'Windsor Green Shopping Center');

COMMIT;
