-- Update feature icons across all service pages to use the expanded icon set
-- Run this in Supabase SQL Editor AFTER update-proposal-services.sql
-- This matches feature titles to more specific icons

-- Food & Drink related
UPDATE service_features SET icon = 'cheese' WHERE LOWER(title) LIKE '%charcuterie%' OR LOWER(title) LIKE '%grazing%';
UPDATE service_features SET icon = 'strawberry' WHERE LOWER(title) LIKE '%strawberr%';
UPDATE service_features SET icon = 'cupcake' WHERE LOWER(title) LIKE '%dessert%' OR LOWER(title) LIKE '%cupcake%' OR LOWER(title) LIKE '%cookie%' OR LOWER(title) LIKE '%sweet%';
UPDATE service_features SET icon = 'champagne' WHERE LOWER(title) LIKE '%champagne%' OR LOWER(title) LIKE '%toast%';
UPDATE service_features SET icon = 'wine' WHERE LOWER(title) LIKE '%wine%';
UPDATE service_features SET icon = 'beer' WHERE LOWER(title) LIKE '%beer%' OR LOWER(title) LIKE '%brew%';
UPDATE service_features SET icon = 'drinks' WHERE LOWER(title) LIKE '%cocktail%' OR LOWER(title) LIKE '%beverage%';
UPDATE service_features SET icon = 'soda' WHERE LOWER(title) LIKE '%soda%' OR LOWER(title) LIKE '%refreshment%';
UPDATE service_features SET icon = 'juicebox' WHERE LOWER(title) LIKE '%juice%';

-- Floral & Decor related
UPDATE service_features SET icon = 'flowers' WHERE LOWER(title) LIKE '%floral%' OR LOWER(title) LIKE '%flower%' OR LOWER(title) LIKE '%bouquet%' OR LOWER(title) LIKE '%centerpiece%';
UPDATE service_features SET icon = 'vase' WHERE LOWER(title) LIKE '%vase%';
UPDATE service_features SET icon = 'balloons' WHERE LOWER(title) LIKE '%balloon%';
UPDATE service_features SET icon = 'lights' WHERE LOWER(title) LIKE '%light%' OR LOWER(title) LIKE '%marquee%' OR LOWER(title) LIKE '%neon%' OR LOWER(title) LIKE '%candle%' OR LOWER(title) LIKE '%lantern%';

-- Furniture & Setup related
UPDATE service_features SET icon = 'chairs' WHERE LOWER(title) LIKE '%chair%' OR LOWER(title) LIKE '%seating%' OR LOWER(title) LIKE '%cushion%';
UPDATE service_features SET icon = 'tables' WHERE LOWER(title) LIKE '%table setting%' OR LOWER(title) LIKE '%place setting%' OR LOWER(title) LIKE '%dinnerware%';
UPDATE service_features SET icon = 'linen' WHERE LOWER(title) LIKE '%linen%' OR LOWER(title) LIKE '%fabric%';
UPDATE service_features SET icon = 'tablecloth' WHERE LOWER(title) LIKE '%tablecloth%';
UPDATE service_features SET icon = 'namecard' WHERE LOWER(title) LIKE '%name card%' OR LOWER(title) LIKE '%place card%';

-- Location & Setting related
UPDATE service_features SET icon = 'outdoors' WHERE LOWER(title) LIKE '%outdoor%' OR LOWER(title) LIKE '%picnic%' OR LOWER(title) LIKE '%backdrop%';
UPDATE service_features SET icon = 'garden' WHERE LOWER(title) LIKE '%garden%' OR LOWER(title) LIKE '%greenery%';
UPDATE service_features SET icon = 'beach' WHERE LOWER(title) LIKE '%beach%';
UPDATE service_features SET icon = 'winery' WHERE LOWER(title) LIKE '%winery%' OR LOWER(title) LIKE '%vineyard%';
UPDATE service_features SET icon = 'scenery' WHERE LOWER(title) LIKE '%scenic%' OR LOWER(title) LIKE '%view%' OR LOWER(title) LIKE '%venue%';

-- Activities & Entertainment
UPDATE service_features SET icon = 'games' WHERE LOWER(title) LIKE '%game%' OR LOWER(title) LIKE '%activit%';
UPDATE service_features SET icon = 'frisbee' WHERE LOWER(title) LIKE '%frisbee%';
UPDATE service_features SET icon = 'cornhole' WHERE LOWER(title) LIKE '%cornhole%';
UPDATE service_features SET icon = 'music' WHERE LOWER(title) LIKE '%music%' OR LOWER(title) LIKE '%speaker%' OR LOWER(title) LIKE '%playlist%';

-- Services & Extras
UPDATE service_features SET icon = 'camera' WHERE LOWER(title) LIKE '%photo%' OR LOWER(title) LIKE '%camera%';
UPDATE service_features SET icon = 'gift' WHERE LOWER(title) LIKE '%gift%' OR LOWER(title) LIKE '%favor%';
UPDATE service_features SET icon = 'truck' WHERE LOWER(title) LIKE '%deliver%' OR LOWER(title) LIKE '%setup%' OR LOWER(title) LIKE '%cleanup%';
UPDATE service_features SET icon = 'dinnerparty' WHERE LOWER(title) LIKE '%dinner%' OR LOWER(title) LIKE '%dining%';
UPDATE service_features SET icon = 'events' WHERE LOWER(title) LIKE '%party%' OR LOWER(title) LIKE '%celebration%' OR LOWER(title) LIKE '%event%';
UPDATE service_features SET icon = 'palette' WHERE LOWER(title) LIKE '%color%' OR LOWER(title) LIKE '%theme%' OR LOWER(title) LIKE '%custom%' OR LOWER(title) LIKE '%design%';
