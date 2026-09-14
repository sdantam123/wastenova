-- Mercer County "Beyond the Bucket" uncommon items guide, batch 1 of N
-- (pages 3-8: Air Fresheners through Formal Wear).
-- Programs are mostly manufacturer mail-in / national retail take-back,
-- not scoped to a single jurisdiction, so jurisdiction_id is left NULL
-- except where a program is Mercer-County-specific.
-- Source: Beyond the Bucket (Mercer County Planning Dept, Sept 2019/2020)

BEGIN;

WITH new_programs AS (
  INSERT INTO recycling_programs (
    material_category, program_name, organization, program_type, accepts,
    not_accepted, how_it_works, incentive
  ) VALUES
    ('Air Fresheners', 'TerraCycle: Febreze Air Care', 'TerraCycle', 'MAIL_IN',
      ARRAY['Any brand air freshener cartridges and plugs', 'Any brand air freshener packaging and flexible film', 'Any brand air freshener plastic trigger heads', 'Febreze ONE bottles with trigger heads', 'Febreze ONE refills'],
      ARRAY['Plastic bottles'], 'Free mail-in program.', NULL),

    ('Architectural Items', 'Recycling the Past', 'Recycling the Past, Inc.', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Architectural salvage company for the home and garden that may be interested in unwanted architectural items. www.recyclingthepast.com', NULL),

    ('Backpacks', 'American Birding Association Backpack Donation', 'American Birding Association', 'MAIL_IN',
      NULL, ARRAY['Backpacks with broken zippers'], 'Mail-in donation program; prefers backpacks with no broken zippers.', NULL),

    ('Batteries', 'Call to Recycle', 'Call to Recycle', 'RETAIL_TAKEBACK', NULL, NULL, 'National battery recycling program.', NULL),
    ('Batteries', 'Lowe''s Battery Recycling', 'Lowe''s', 'RETAIL_TAKEBACK',
      ARRAY['CFL bulbs', 'Rechargeable batteries'], NULL, 'In-store collection containers.', NULL),
    ('Batteries', 'Home Depot Battery Recycling', 'Home Depot', 'RETAIL_TAKEBACK',
      ARRAY['CFL bulbs', 'Rechargeable batteries'], NULL, 'In-store collection containers.', NULL),
    ('Batteries', 'Staples Battery Recycling', 'Staples', 'RETAIL_TAKEBACK',
      ARRAY['Rechargeable batteries', 'Old tech', 'Ink/toner'], NULL, 'Free in-store recycling.', NULL),

    ('Beauty Products', 'Aveda Packaging Take-Back', 'Aveda', 'RETAIL_TAKEBACK',
      ARRAY['Rollerballs', 'Dispensing systems', 'Applicators'], NULL, 'Return any Aveda packaging not typically recycled in curbside bins to an Aveda counter/store.', NULL),
    ('Beauty Products', 'TerraCycle: Burt''s Bees', 'TerraCycle', 'MAIL_IN',
      ARRAY['Burt''s Bees personal care packaging', 'Burt''s Bees beauty care packaging', 'Burt''s Bees lip care packaging'], NULL, 'Free mail-in program.', NULL),
    ('Beauty Products', 'TerraCycle: eos Lip Balm and Skin Care', 'TerraCycle', 'MAIL_IN',
      ARRAY['eos Lip Packaging', 'eos Shave Packaging', 'eos Lotion Packaging'], NULL, 'Free mail-in program.', NULL),
    ('Beauty Products', 'TerraCycle: Garnier', 'TerraCycle', 'MAIL_IN',
      ARRAY['Hair care packaging (shampoo caps, conditioner caps, hair gel tubes/caps, hair spray triggers, hair paste caps)', 'Skin care packaging (lip balm tubes/caps, soap dispensers/tubes, body wash caps, lotion dispensers/caps)', 'Cosmetics packaging (lipstick cases, lip gloss tubes, mascara tubes, eye shadow cases, bronzer cases, foundation packaging, powder cases, eyeliner cases/pencils, eye shadow tubes, concealer tubes/sticks, lip liner pencils)'],
      NULL, 'Free mail-in program.', NULL),
    ('Beauty Products', 'TerraCycle: Herbal Essences', 'TerraCycle', 'MAIL_IN',
      ARRAY['Shampoo and conditioner bottles and caps', 'Hair mist bottles and pumps', 'Flexible plastic tubes and closures', 'Color and hair treatment packets'],
      ARRAY['Aerosol containers'], 'Free mail-in program.', NULL),
    ('Beauty Products', 'Lush Empty Pot Return', 'Lush', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring back 5 clean, empty product pots to a Lush store; pots are 100% made from recycled products.', 'Free Fresh Face Mask'),
    ('Beauty Products', 'Kiehl''s Recycling Program', 'Kiehl''s', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Return 10 full-size items over 10 months (1 per month).', 'Free travel-size item (up to $11 value)'),
    ('Beauty Products', 'L''Occitane Packaging Take-Back', 'L''Occitane', 'RETAIL_TAKEBACK',
      ARRAY['Lip balm tubes', 'Makeup remover bottles and pumps', 'Fragrance bottles and pumps', 'Deodorant sticks', 'Face mask packaging', 'Eco-refill pouches', 'Dispensers and tubes for soap/facial cleansers/body lotions', 'Shampoo and conditioner pumps and caps', 'Hair care dispensers and containers', 'Hair product trigger heads'],
      NULL, 'Bring in beauty, skincare, or hair care packaging to a store.', '10% off next full-size product'),
    ('Beauty Products', 'MAC Cosmetics Back-to-MAC', 'MAC Cosmetics', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Return or send in 6 MAC primary packaging containers. First cosmetic company to offer a take-back program.', 'One free MAC lipstick'),
    ('Beauty Products', 'Origins Packaging Take-Back', 'Origins', 'RETAIL_TAKEBACK',
      ARRAY['Any glass or plastic jars, bottles, tubes, lipstick covers and caps'],
      ARRAY['Sample or trial size packaging', 'Applicators (sponges, tweezers)', 'Paper boxes', 'Plastic wrapping'],
      'Drop off empty primary packaging at any retail or department store counter carrying Origins.', NULL),
    ('Beauty Products', 'Project Beauty Share', 'Project Beauty Share', 'MAIL_IN',
      NULL, NULL, 'Accepts new/gently used beauty products; website lists which products must be new to be donated.', NULL),

    ('Bicycles', 'Trenton Bike Exchange', 'Trenton Bike Exchange', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Provides low-cost, quality bikes for Mercer County families and individuals; raises money for the Boys & Girls Club of Trenton''s after-school programs.', NULL),

    ('Books', 'Mercer County Library Book Donations', 'Mercer County Library', 'MUNICIPAL',
      NULL, NULL, 'Mercer County Library branches accept book donations; proceeds go toward children''s and adult programming and other library initiatives. Check with your local branch for specific donation guidelines.', NULL),

    ('Bras', 'I Support the Girls', 'I Support the Girls', 'MAIL_IN', NULL, NULL, 'Mail-in bra donation program.', NULL),
    ('Bras', 'Free the Girls', 'Free the Girls', 'MAIL_IN', NULL, NULL, 'Mail-in bra donation program.', NULL),
    ('Bras', 'The Bra Recyclers', 'The Bra Recyclers', 'MAIL_IN', NULL, NULL, 'Mail-in bra donation program.', NULL),
    ('Bras', 'Donate Your Bras', 'Donate Your Bras', 'MAIL_IN', NULL, NULL, 'Mail-in bra donation program.', NULL),

    ('Brita Water Filters', 'TerraCycle: Brita', 'TerraCycle', 'MAIL_IN',
      ARRAY['Brita Dispensers', 'Brita Bottles', 'Brita Bottle Filters', 'Brita Standard Filters', 'Brita Stream Filters', 'Brita Longlast Filters', 'Brita filter packaging', 'Brita faucet filtration system', 'Brita pitchers'],
      NULL, 'Free mail-in program.', NULL),

    ('Building Supplies', 'Habitat for Humanity ReStore', 'Habitat for Humanity', 'RETAIL_TAKEBACK',
      ARRAY['Kitchen cabinets', 'Doors and windows', 'Flooring', 'Unused lumber', 'Lighting fixtures', 'Fencing', 'Bricks/blocks'],
      NULL, 'Independently owned reuse stores operated by local Habitat for Humanity organizations that accept donations and sell home improvement items at a fraction of retail price. Closest location: Langhorne ReStore of Bucks County HFH, 1337 E. Lincoln Highway, Langhorne, PA 19056.', NULL),
    ('Building Supplies', 'Hamilton Ecological Facility', 'Hamilton Township', 'MUNICIPAL',
      NULL, NULL, 'Open only to Hamilton residents; see Hamilton Ecological Facility municipal program for details.', NULL),

    ('Business Attire', 'Dress for Success', 'Dress for Success', 'RETAIL_TAKEBACK',
      NULL, NULL, 'International non-profit empowering women to achieve economic independence by providing professional attire to women in need. Location in Mercer County: 3131 Princeton Pike, Building 4, Suite 209.', NULL),
    ('Business Attire', 'Career Gear', 'Career Gear', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Promotes economic independence of low-income men via financial literacy training, professional attire, career development tools, job-readiness and life-skills training. Closest location: 125 Maiden Lane 3B, New York City.', NULL),

    ('Cars', 'PAC Cars Ministry', 'Princeton Alliance Church', 'MAIL_IN', NULL, NULL, 'Vehicle donation program supporting church causes. https://princetonalliance.org/bring-hope/care/cars-ministry/', NULL),
    ('Cars', 'HomeFront Car Donation', 'HomeFront', 'MAIL_IN', NULL, NULL, 'Vehicle donation program. https://www.homefrontnj.org/', NULL),

    ('Carpeting', 'CarpetCycle', 'CarpetCycle', 'MAIL_IN', NULL, NULL, 'Residential drop-off not currently in service; call for pickup. Commercial drop-off and pickup in service.', NULL),

    ('Cellphones', 'Apple Trade In / Recycling', 'Apple', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Check if Apple products are eligible for buyback (refurbished/resold); ineligible products can still be sent to Apple for recycling. Location in Mercer County: Quaker Bridge Mall.', NULL),
    ('Cellphones', 'Lowe''s Cellphone Recycling', 'Lowe''s', 'RETAIL_TAKEBACK', NULL, NULL, 'In-store collection containers.', NULL),
    ('Cellphones', 'Home Depot Cellphone Recycling', 'Home Depot', 'RETAIL_TAKEBACK', NULL, NULL, 'In-store collection containers.', NULL),
    ('Cellphones', 'Target Electronics Trade-In', 'Target', 'RETAIL_TAKEBACK',
      ARRAY['MP3 players', 'Cellphones', 'Ink cartridges'], NULL, 'Trade in old electronics for a Target gift card; in-store kiosks for MP3 players, cellphones, and ink cartridges. Locations in Mercer County: Nassau Park Pavilion (West Windsor); East Windsor Village.', 'Target gift card'),
    ('Cellphones', 'Verizon Wireless Device Recycling', 'Verizon Wireless', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Return any phone brand or carrier to Verizon for a gift card if reusable, otherwise recycled. Can also donate to Verizon''s HopeLine charity supporting domestic violence survivors. Locations in Mercer County: Hamilton Marketplace; 950 Route 33, Hamilton; Mercer Mall; 200 Campus Town Center, Ewing; Quaker Bridge Mall; Princeton Shopping Center.', 'Gift card or HopeLine donation'),

    ('Cereal Bags', 'TerraCycle: Malt-O-Meal', 'TerraCycle', 'MAIL_IN',
      ARRAY['Any brand plastic cereal bags and plastic cereal bag liners'], NULL, 'Free mail-in program.', NULL),

    ('Cigarette Waste', 'TerraCycle: Cigarette Waste', 'TerraCycle', 'MAIL_IN',
      ARRAY['Extinguished cigarettes', 'Cigarette filters', 'Loose tobacco pouches', 'Outer plastic packaging', 'Inner foil packaging', 'Rolling paper', 'Ash'],
      NULL, 'Free mail-in program.', NULL),

    ('Clothing', 'American Eagle Jean Recycling', 'American Eagle', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring in jeans to an American Eagle store. Location in Mercer County: Quaker Bridge Mall.', '$10 off next pair'),
    ('Clothing', '& Other Stories Clothing Recycling', '& Other Stories', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring in any brand of clothes/shoes to be recycled. Closest location: New York City.', '10% off next purchase'),
    ('Clothing', 'Eileen Fisher Take Back', 'Eileen Fisher', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Return Eileen Fisher label clothing to a store; clothes are resold on the Eileen Fisher website or sold to a textile company. Locations in New Jersey: 45 Enterprise Ave. N., Secaucus; Short Hills Mall.', '$5 store credit per item'),
    ('Clothing', 'Homefront Furnish the Future', 'HomeFront', 'MAIL_IN',
      ARRAY['Gently used clothing bagged, boxed or hanging'], NULL, 'HomeFront''s mission is to end homelessness in Central New Jersey; Furnish the Future helps over 500 families a year.', NULL),
    ('Clothing', 'Levi Strauss & Co Take Back', 'Levi Strauss & Co', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring any brand of clothes and shoes to a Levi Strauss store; items re-worn, repurposed, or recycled. Locations in New Jersey: Jackson Premium Outlets, Jersey Shore Premium Outlets, Gloucester Premium Outlets, The Mills at Jersey Gardens, Tanger Outlets Atlantic City.', '20% off single item'),
    ('Clothing', 'Madewell Jean Recycling', 'Madewell', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring in old jeans; used for housing insulation. Locations in New Jersey: Bridgewater Commons, The Grove West, Westfield Garden State Plaza, The Mall at Short Hills, Tice''s Corner Marketplace.', '$20 off a new pair'),
    ('Clothing', 'The North Face Clothes the Loop', 'The North Face', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring any brand of clothes and shoes to a store; sent to Shoes4Souls nonprofit for sustainable jobs and clothing relief. Locations in New Jersey: Cherry Hill Mall, Westfield Garden State Plaza.', '$10 voucher toward $100+ purchase'),
    ('Clothing', 'Patagonia Worn Wear', 'Patagonia', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring in Patagonia brand items. Closest location: 72 Greene St., New York City.', 'Store credit'),
    ('Clothing', 'Rag & Bone Denim Recycling', 'Rag & Bone', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring in old denim. Closest location: 182A Columbus Ave., New York City.', '20% off denim purchase that day'),

    ('Coloring Materials', 'Crazy Crayons Donation', 'Crazy Crayons', 'MAIL_IN',
      NULL, NULL, 'Donate unwanted or broken crayons for distribution at art programs, hospitals, orphanages, women''s/homeless shelters and low-income day cares. Shipping label not covered by company.', NULL),
    ('Coloring Materials', 'Crayola ColorCycle', 'Crayola', 'MAIL_IN',
      NULL, NULL, 'Set up a donation center through your school to send used markers.', NULL),

    ('Compact Discs', 'Monmouth Recycling CD Recycling', 'Monmouth Recycling', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Accepts disc items to be recycled at 50 cents a pound. Location: Tinton Falls, NJ.', NULL),
    ('Compact Discs', 'Library CD Donations', 'Local Libraries', 'MUNICIPAL',
      NULL, NULL, 'Most libraries will accept donations of used CDs; check with your local library.', NULL),

    ('Compact Fluorescent Bulbs', 'Lowe''s CFL Bulb Recycling', 'Lowe''s', 'RETAIL_TAKEBACK',
      ARRAY['CFL bulbs', 'Rechargeable batteries', 'Plant pots, trays, and tags'], NULL, 'In-store collection containers.', NULL),

    ('Computers', 'Apple Trade In / Recycling', 'Apple', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Check if Apple products are eligible for buyback; ineligible products can be sent for recycling. Location in Mercer County: Quaker Bridge Mall.', NULL),
    ('Computers', 'Best Buy Computer Recycling', 'Best Buy', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Bring in computer to store; bought back and resold or recycled. Location in Mercer County: Nassau Park Pavilion, West Windsor.', NULL),
    ('Computers', 'Staples Tech Trade-In', 'Staples', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Tech Trade-In: get Staples cash for wanted devices; unwanted devices recycled. Locations in Mercer County: Hamilton Marketplace; Lawrence Shopping Center; Shops at Windsor Green (West Windsor); Route 130 South, East Windsor.', 'Staples cash'),
    ('Computers', 'Target Electronics Trade-In', 'Target', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Trade in old electronics for a Target gift card. Locations in Mercer County: Nassau Park Pavilion, West Windsor; East Windsor Village.', 'Target gift card'),

    ('Contacts', 'TerraCycle: Bausch + Lomb ONE by ONE', 'TerraCycle', 'MAIL_IN',
      ARRAY['Any brand contact lenses and blister packs'], NULL, 'Free mail-in program.', NULL),

    ('Dental Hygiene', 'TerraCycle: Colgate Oral Care', 'TerraCycle', 'MAIL_IN',
      ARRAY['Toothpaste tubes and caps', 'Toothbrushes', 'Toothpaste cartons', 'Floss containers'],
      ARRAY['Electric toothbrushes', 'Battery toothbrushes and/or their non-recyclable parts'], 'Free mail-in program.', NULL),
    ('Dental Hygiene', 'TerraCycle: Tom''s of Maine', 'TerraCycle', 'MAIL_IN',
      ARRAY['Mouthwash bottles and caps', 'Deodorant containers and caps', 'Toothpaste tubes and caps', 'Soap packaging', 'Floss containers and toothbrushes'],
      NULL, 'Free mail-in program.', NULL),

    ('Digital Versatile Disks (DVDs)', 'Library DVD Donations', 'Local Libraries', 'MUNICIPAL',
      NULL, NULL, 'Most libraries will accept donations of used DVDs; check with your local library.', NULL),

    ('Dixon Brand Classroom Supplies', 'TerraCycle: Dixon', 'TerraCycle', 'MAIL_IN',
      ARRAY['Prang Art Markers', 'Ticonderoga Highlighters', 'Ticonderoga & Dixon Pencils (mechanical and wood)', 'LYRA & Prang Paint Kits', 'Prang Glue Sticks', 'Prang & Dixon Erasers', 'Prang & LYRA Colored Pencils'],
      NULL, 'Free mail-in program.', NULL),
    ('Dixon Brand Classroom Supplies', 'TerraCycle: Honest Kids', 'TerraCycle', 'MAIL_IN',
      ARRAY['Aluminum and plastic drink pouches without the straw'], NULL, 'Free mail-in program.', NULL),

    ('Energy Bar Wrapper', 'TerraCycle: Clif Bar', 'TerraCycle', 'MAIL_IN',
      ARRAY['Any Clif brand products', 'Any foil-lined energy bar wrappers'], NULL, 'Free mail-in program.', NULL),

    ('Eyeglasses', 'New Jersey Lions Club Eyeglass Recycling', 'New Jersey Lions Club', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Accepts all types of glasses, prescription or nonprescription; cleaned/repaired and donated to those in need. Locations in Mercer County: Hopewell Valley (Pennington Quality Market, Stony Brook Elementary School, Pennington Presbyterian Church), West Windsor (Vision Center at Wal-Mart, McCaffrey''s Supermarket, West Windsor Library).', NULL),
    ('Eyeglasses', 'New Eyes Eyeglass Recycling', 'New Eyes', 'MAIL_IN',
      NULL, NULL, 'Accepts all types of glasses, prescription or nonprescription; recycled and donated to needy persons in the US and overseas.', NULL),

    ('Fabric Care/Laundry', 'TerraCycle: Laundry Packaging', 'TerraCycle', 'MAIL_IN',
      ARRAY['Paperboard laundry care packaging', 'All brands of #5/#2 plastic laundry caps'], NULL, 'Free mail-in program. Caps must be secured to their respective bottles when being recycled.', NULL),
    ('Fabric Care/Laundry', 'TerraCycle: Arm & Hammer and OxiClean', 'TerraCycle', 'MAIL_IN',
      ARRAY['Arm & Hammer Baking Soda pouches', 'Arm & Hammer Power Paks Laundry Detergent pouches', 'OxiClean Detergent Paks pouches', 'OxiClean 2-in-1 Stain Fighter Power Paks pouches', 'OxiClean White Revive Laundry Stain Remover Power Paks pouches'],
      NULL, 'Free mail-in program.', NULL),

    ('Food (Surplus)', 'Food Pantries Network', 'Various Food Banks/Pantries', 'MUNICIPAL',
      NULL, NULL, 'Numerous food banks/pantries in New Jersey accept donations of surplus food. https://www.foodpantries.org/st/new_jersey', NULL),
    ('Food (Surplus)', 'Rock and Wrap It Up!', 'Rock and Wrap It Up! Inc.', 'MAIL_IN',
      NULL, NULL, 'Nonprofit that helps recover extra food from music and sporting events, among other places, and donates it to shelters. http://www.rockandwrapitup.org', NULL),

    ('Formal Wear', 'Becca''s Closet', 'Becca''s Closet', 'RETAIL_TAKEBACK',
      NULL, NULL, 'Non-profit offering new and gently-worn formal dresses to high school girls for prom and special occasions at no cost. Location in New Jersey: 400 Jefferson St., Hackettstown.', NULL),
    ('Formal Wear', 'Project Glam', 'Project Glam', 'MAIL_IN',
      NULL, NULL, 'Accepts dresses up to 10 years old (or older, if the dress is black).', NULL),
    ('Formal Wear', 'Angel Gown Program', 'Angel Gown Program', 'MAIL_IN',
      NULL, NULL, 'Provides comfort for bereaved families through the gift of a custom made gown for final photos and burial services.', NULL),
    ('Formal Wear', 'Brides Across America', 'Brides Across America', 'MAIL_IN', NULL, NULL, 'Supports military brides with donated wedding gowns.', NULL),
    ('Formal Wear', 'Brides Against Breast Cancer', 'Brides Against Breast Cancer', 'MAIL_IN', NULL, NULL, 'Wedding gown donation program.', NULL)
  RETURNING id, material_category, program_name
)
SELECT count(*) FROM new_programs;

COMMIT;
