-- Municipal Public Works / Recycling Coordinator contact numbers for all
-- 25 Middlesex County municipalities (back cover of the 2026 guide).
-- Modeled as one MUNICIPAL program per town so each jurisdiction has a
-- queryable "who do I call" record, consistent with the Mercer municipal
-- programs pattern.

BEGIN;

INSERT INTO recycling_programs (
  material_category, program_name, organization, program_type, how_it_works, jurisdiction_id
) VALUES
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Carteret Public Works', 'MUNICIPAL', 'Public Works: 732-541-3881. Recycling: 732-541-3881.', 'jur_us_nj_middlesex_carteret'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Cranbury Public Works', 'MUNICIPAL', 'Public Works: 609-664-3123. Recycling: 609-664-3130.', 'jur_us_nj_middlesex_cranbury'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Dunellen Public Works', 'MUNICIPAL', 'Public Works: 732-968-5455. Recycling: 732-968-5455.', 'jur_us_nj_middlesex_dunellen'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'East Brunswick Public Works', 'MUNICIPAL', 'Public Works: 732-390-6984. Recycling: 732-432-6011.', 'jur_us_nj_middlesex_eastbrunswick'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Edison Public Works', 'MUNICIPAL', 'Public Works: 732-248-7288. Recycling: 732-248-7288.', 'jur_us_nj_middlesex_edison'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Helmetta Public Works', 'MUNICIPAL', 'Public Works: 732-521-4946 x110. Recycling: 732-521-4946 x110.', 'jur_us_nj_middlesex_helmetta'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Highland Park Public Works', 'MUNICIPAL', 'Public Works: 732-247-9379. Recycling: 732-514-1277.', 'jur_us_nj_middlesex_highlandpark'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Jamesburg Public Works', 'MUNICIPAL', 'Public Works: 732-521-3335. Recycling: 732-521-3335.', 'jur_us_nj_middlesex_jamesburg'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Metuchen Public Works', 'MUNICIPAL', 'Public Works: 732-632-8519. Recycling: 732-632-8518.', 'jur_us_nj_middlesex_metuchen'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Middlesex Borough Public Works', 'MUNICIPAL', 'Public Works: 732-968-1603. Recycling: 732-356-7953.', 'jur_us_nj_middlesex_middlesexborough'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Milltown Public Works', 'MUNICIPAL', 'Public Works: 732-828-2100 x136. Recycling: 732-828-2100 x136.', 'jur_us_nj_middlesex_milltown'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Monroe Township Public Works', 'MUNICIPAL', 'Public Works: 732-656-4575. Recycling: 732-656-4575.', 'jur_us_nj_middlesex_monroetownship'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'New Brunswick Public Works', 'MUNICIPAL', 'Public Works: 732-745-5104. Recycling: 732-745-5059.', 'jur_us_nj_middlesex_newbrunswick'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'North Brunswick Public Works', 'MUNICIPAL', 'Public Works: 732-297-1134. Recycling: 732-297-1134.', 'jur_us_nj_middlesex_northbrunswick'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Old Bridge Public Works', 'MUNICIPAL', 'Public Works: 732-721-5600 x6140. Recycling: 732-721-5600 x6107.', 'jur_us_nj_middlesex_oldbridge'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Perth Amboy Public Works', 'MUNICIPAL', 'Public Works: 732-826-2010. Recycling: 732-826-2010 x4204.', 'jur_us_nj_middlesex_perthamboy'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Piscataway Public Works', 'MUNICIPAL', 'Public Works: 732-562-2390. Recycling: 732-562-2390.', 'jur_us_nj_middlesex_piscataway'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Plainsboro Public Works', 'MUNICIPAL', 'Public Works: 609-799-0099. Recycling: 609-799-0099.', 'jur_us_nj_middlesex_plainsborotownship'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Sayreville Public Works', 'MUNICIPAL', 'Public Works: 732-390-7042. Recycling: 732-390-7008.', 'jur_us_nj_middlesex_sayreville'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'South Amboy Public Works', 'MUNICIPAL', 'Public Works: 732-721-8100. Recycling: 732-727-4600.', 'jur_us_nj_middlesex_southamboy'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'South Brunswick Public Works', 'MUNICIPAL', 'Public Works: 732-329-4000 x7260. Recycling: 732-329-4000 x7274.', 'jur_us_nj_middlesex_southbrunswick'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'South Plainfield Public Works', 'MUNICIPAL', 'Public Works: 908-755-2187. Recycling: 908-755-2187.', 'jur_us_nj_middlesex_southplainfield'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'South River Public Works', 'MUNICIPAL', 'Public Works: 732-257-9051. Recycling: 732-257-9051.', 'jur_us_nj_middlesex_southriver'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Spotswood Public Works', 'MUNICIPAL', 'Public Works: 732-251-0700 x8022. Recycling: 732-251-0700 x8022.', 'jur_us_nj_middlesex_spotswood'),
  ('General Recycling/Solid Waste Contact', 'Municipal Recycling Contact', 'Woodbridge Public Works', 'MUNICIPAL', 'Public Works: 732-738-1311. Recycling: 732-738-1311 x3035.', 'jur_us_nj_middlesex_woodbridge');

COMMIT;
