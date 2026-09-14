-- Middlesex County Household Hazardous Waste (HHW) events are one-off dated
-- events, just like the Residential Paper Shredding schedule, per
-- source_docs/nj/Middlesex_county_HHW.png. Adds the 5 event dates/locations
-- to the existing HHW program (id 176), which previously had none.

INSERT INTO program_locations (program_id, location_name, address_line1, city, state, postal_code, notes, event_date, latitude, longitude)
VALUES
  (176, 'Middlesex College', '2600 Woodbridge Avenue (Mill Road entrance)', 'Edison', 'NJ', '08837', 'Sunday, March 15, 8am-2pm', '2026-03-15', 40.5225000, -74.3765000),
  (176, 'Middlesex County Public Works', '97 Apple Orchard Lane', 'North Brunswick', 'NJ', '08902', 'Saturday, May 16, 8am-2pm', '2026-05-16', 40.4462000, -74.4726000),
  (176, 'Old Bridge Recycling Center', '1 Old Bridge Plaza (off Route 516)', 'Old Bridge', 'NJ', '08857', 'Sunday, June 28, 8am-2pm', '2026-06-28', 40.4034213, -74.2979160),
  (176, 'Middlesex County Public Works', '750 Jernee Mill Road', 'Sayreville', 'NJ', '08872', 'Saturday, September 19, 8am-2pm', '2026-09-19', 40.4462000, -74.3311000),
  (176, 'Middlesex College', '2600 Woodbridge Avenue (Mill Road entrance)', 'Edison', 'NJ', '08837', 'Sunday, November 15, 8am-2pm', '2026-11-15', 40.5225000, -74.3765000);
