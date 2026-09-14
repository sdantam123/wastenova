-- Structured location rows for Middlesex County programs with concrete
-- addresses (transfer stations, hospitals, paper shredding event sites).

BEGIN;

-- 147: Private Transfer Stations
INSERT INTO program_locations (program_id, location_name, address_line1, city, state, postal_code, notes) VALUES
  (147, 'Freehold Cartage', '825 Highway 33', 'Freehold', 'NJ', '07728', 'Phone: 732-462-1001 x7126'),
  (147, 'Mazza and Sons, Inc.', '3230 Shafto Road', 'Tinton Falls', 'NJ', '07753', 'Phone: 732-922-9292'),
  (147, 'Republic/MIDCO (Middlesex)', '92 Baekeland Avenue', 'Middlesex', 'NJ', '08846', 'Phone: 732-469-3777'),
  (147, 'Republic/MIDCO (New Brunswick)', '5 Industrial Drive', 'New Brunswick', 'NJ', '08901', 'Phone: 732-545-8988'),
  (147, 'IWS', '986 Jersey Avenue', 'New Brunswick', 'NJ', '08901', 'Phone: 732-696-1215');

-- 143: NJ Hospital Association Safe Syringe Program
INSERT INTO program_locations (program_id, location_name, address_line1, city, state, postal_code, notes) VALUES
  (143, 'St. Peter''s University Hospital', '254 Easton Avenue', 'New Brunswick', 'NJ', '08901', 'Phone: 732-745-8600 x6010'),
  (143, 'Penn Medicine Princeton Health', '1 Plainsboro Road', 'Plainsboro', 'NJ', '08536', 'Phone: 609-853-6140'),
  (143, 'JFK Medical Center', '65 James Street', 'Edison', 'NJ', '08818', 'Phone: 732-321-7539'),
  (143, 'RWJ University Hospital Somerset', '110 Rehill Avenue', 'Somerville', 'NJ', '08876', 'Phone: 908-685-2200');

-- 139: Residential Paper Shredding Events (2026 one-time event sites)
INSERT INTO program_locations (program_id, location_name, address_line1, city, state, postal_code, notes) VALUES
  (139, 'Old Bridge Recycling Center', '1 Old Bridge Plaza', 'Old Bridge', 'NJ', '08857', 'Sunday, March 22, 9am-12pm'),
  (139, 'Merrill Park', 'Fairway Avenue', 'Colonia', 'NJ', '07067', 'Friday, April 10, 9am-12pm'),
  (139, 'Sayreville Recycling Center (Fort Grumpy)', '3750 Bordentown Avenue', 'Sayreville', 'NJ', '08872', 'Saturday, April 18, 9am-12pm'),
  (139, 'Babbage Park', 'Laurel Place', 'North Brunswick', 'NJ', '08902', 'Saturday, May 2, 9am-12pm'),
  (139, 'Crystal Springs Waterpark', '380 Dunhams Corner Road', 'East Brunswick', 'NJ', '08816', 'Friday, May 8, 9am-12pm'),
  (139, 'Papaianni Park', '100 Municipal Boulevard', 'Edison', 'NJ', '08817', 'Sunday, June 7, 9am-12pm'),
  (139, 'Spotswood High School Parking Lot', '105 Summerhill Road', 'Spotswood', 'NJ', '08884', 'Saturday, June 27, 9am-12pm'),
  (139, 'Beech Woods Park', '137 Beekman Road', 'South Brunswick', 'NJ', '08852', 'Sunday, August 30, 9am-12pm'),
  (139, 'Woodbridge Public Works', '225 Smith Street', 'Keasbey', 'NJ', '08832', 'Sunday, September 27, 9am-12pm'),
  (139, 'Donaldson Park', 'South Second Avenue', 'Highland Park', 'NJ', '08904', 'Friday, October 9, 9am-12pm'),
  (139, 'Cranbury School', '23 North Main Street', 'Cranbury', 'NJ', '08512', 'Saturday, October 17, 9am-12pm'),
  (139, 'Thompson Park (lot near Manalapan Lake)', NULL, 'Monroe', 'NJ', '08831', 'Friday, November 6, 9am-12pm');

COMMIT;
