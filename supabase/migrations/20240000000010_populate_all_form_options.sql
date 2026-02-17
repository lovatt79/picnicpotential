-- Populate Event Types (existing table: form_event_types)
DELETE FROM form_event_types;
INSERT INTO form_event_types (label, value, sort_order, is_active) VALUES
('Picnic', 'picnic', 1, true),
('Tablescapes', 'tablescapes', 2, true),
('Event Decor', 'event-decor', 3, true),
('Rentals', 'rentals', 4, true);

-- Populate Color Options (from Google Form - 16+ color schemes)
DELETE FROM form_color_options;
INSERT INTO form_color_options (label, sort_order, is_active) VALUES
('Blush/Nude', 1, true),
('Burgundy/Wine', 2, true),
('Dusty Blue', 3, true),
('Sage Green', 4, true),
('Terracotta/Rust', 5, true),
('Black & White', 6, true),
('Navy Blue', 7, true),
('Lavender/Purple', 8, true),
('Mustard/Gold', 9, true),
('Coral/Peach', 10, true),
('Forest Green', 11, true),
('Rainbow/Multi-color', 12, true),
('White/Cream', 13, true),
('Pink & Gold', 14, true),
('Fall Colors', 15, true),
('Holiday/Christmas', 16, true);

-- Populate Food Options (from Google Form)
DELETE FROM form_food_options;
INSERT INTO form_food_options (label, price, price_unit, min_quantity, sort_order, is_active) VALUES
('Charcuterie', 25.00, 'per_person', 2, 1, true),
('Brunch Board/Box', 25.00, 'per_person', 1, 2, true),
('Sandwich Box', 20.00, 'per_person', 1, 3, true),
('Wraps & Salads', 18.00, 'per_person', 2, 4, true),
('Appetizer Platter', 75.00, 'flat', 1, 5, true),
('Fruit Platter', 50.00, 'flat', 1, 6, true);

-- Populate Dessert Options (from Google Form - 25+ options with vegan variants)
DELETE FROM form_dessert_options;
INSERT INTO form_dessert_options (label, price, price_unit, min_quantity, is_vegan, sort_order, is_active) VALUES
('Chocolate Chip Cookies', 15.00, 'per_dozen', 1, false, 1, true),
('Chocolate Chip Cookies (Vegan)', 18.00, 'per_dozen', 1, true, 2, true),
('Sugar Cookies', 15.00, 'per_dozen', 1, false, 3, true),
('Sugar Cookies (Vegan)', 18.00, 'per_dozen', 1, true, 4, true),
('Snickerdoodles', 15.00, 'per_dozen', 1, false, 5, true),
('Oatmeal Raisin Cookies', 15.00, 'per_dozen', 1, false, 6, true),
('Peanut Butter Cookies', 15.00, 'per_dozen', 1, false, 7, true),
('Double Chocolate Cookies', 16.00, 'per_dozen', 1, false, 8, true),
('M&M Cookies', 16.00, 'per_dozen', 1, false, 9, true),
('Brownies', 20.00, 'per_dozen', 1, false, 10, true),
('Brownies (Vegan)', 24.00, 'per_dozen', 1, true, 11, true),
('Blondies', 20.00, 'per_dozen', 1, false, 12, true),
('Lemon Bars', 22.00, 'per_dozen', 1, false, 13, true),
('Mini Cheesecakes', 30.00, 'per_dozen', 1, false, 14, true),
('Cupcakes', 30.00, 'per_dozen', 1, false, 15, true),
('Cupcakes (Vegan)', 35.00, 'per_dozen', 1, true, 16, true),
('Macarons', 35.00, 'per_dozen', 1, false, 17, true),
('Cake Pops', 25.00, 'per_dozen', 1, false, 18, true),
('Mini Donuts', 20.00, 'per_dozen', 1, false, 19, true),
('Rice Krispy Treats', 18.00, 'per_dozen', 1, false, 20, true),
('Chocolate Covered Strawberries', 30.00, 'per_dozen', 1, false, 21, true),
('Fruit Tart', 40.00, 'flat', 1, false, 22, true),
('Mini Pies', 35.00, 'per_dozen', 1, false, 23, true),
('Cookie Sandwiches', 25.00, 'per_dozen', 1, false, 24, true),
('Assorted Dessert Platter', 60.00, 'flat', 1, false, 25, true);

-- Populate Add-on Options (from Google Form - organized by category)
DELETE FROM form_addon_options;
INSERT INTO form_addon_options (label, category, price, price_unit, sort_order, is_active) VALUES
-- Lawn Games
('Cornhole Set', 'Lawn Games', 50.00, 'flat', 1, true),
('Giant Jenga', 'Lawn Games', 40.00, 'flat', 2, true),
('Frisbee Set', 'Lawn Games', 20.00, 'flat', 3, true),
('Bocce Ball', 'Lawn Games', 30.00, 'flat', 4, true),
('Croquet Set', 'Lawn Games', 45.00, 'flat', 5, true),

-- Furniture
('Low Picnic Table', 'Furniture', 75.00, 'flat', 6, true),
('Vintage Chair (each)', 'Furniture', 25.00, 'flat', 7, true),
('Poufs/Floor Cushions', 'Furniture', 15.00, 'flat', 8, true),
('Rug Upgrade', 'Furniture', 50.00, 'flat', 9, true),

-- Flowers
('Fresh Floral Centerpiece', 'Flowers', 75.00, 'flat', 10, true),
('Petite Bud Vases', 'Flowers', 40.00, 'flat', 11, true),
('Floral Garland', 'Flowers', 100.00, 'flat', 12, true),
('Bridal Bouquet', 'Flowers', 150.00, 'flat', 13, true),

-- Photography
('30-Minute Photo Session', 'Photography', 150.00, 'flat', 14, true),
('1-Hour Photo Session', 'Photography', 250.00, 'flat', 15, true),
('Polaroid Camera Rental', 'Photography', 50.00, 'flat', 16, true),

-- Tents
('Market Umbrella', 'Tents', 50.00, 'flat', 17, true),
('10x10 Pop-up Tent', 'Tents', 100.00, 'flat', 18, true),
('Luxury Bell Tent', 'Tents', 300.00, 'flat', 19, true),

-- Beverages
('Lemonade Dispenser', 'Beverages', 40.00, 'flat', 20, true),
('Champagne Toast (per person)', 'Beverages', 8.00, 'per_person', 21, true),
('Sparkling Cider (per person)', 'Beverages', 5.00, 'per_person', 22, true);

-- Populate Occasion Options (from Google Form)
DELETE FROM form_occasion_options;
INSERT INTO form_occasion_options (label, sort_order, is_active) VALUES
('Just for Fun / Friends Gathering', 1, true),
('Birthday', 2, true),
('Anniversary', 3, true),
('Bridal Shower', 4, true),
('Bachelor/Bachelorette Party', 5, true),
('Baby Shower', 6, true),
('Gender Reveal', 7, true),
('Engagement Party', 8, true),
('Proposal', 9, true),
('Corporate Event', 10, true),
('Team Building', 11, true),
('Holiday Celebration', 12, true),
('Graduation', 13, true),
('Retirement', 14, true),
('Family Reunion', 15, true),
('Date Night', 16, true),
('Other', 17, true);

-- Populate Attribution/Referral Sources (from Google Form)
DELETE FROM form_attribution_options;
INSERT INTO form_attribution_options (label, sort_order, is_active) VALUES
('Past Client', 1, true),
('Facebook', 2, true),
('Instagram', 3, true),
('TikTok', 4, true),
('Google Search', 5, true),
('Friend/Family Referral', 6, true),
('Wedding Vendor', 7, true),
('Winery/Venue Partner', 8, true),
('Magazine/Blog Article', 9, true),
('Event/Bridal Show', 10, true),
('Other', 11, true);

-- Populate Time Add-on Options (from Google Form)
DELETE FROM form_time_addon_options;
INSERT INTO form_time_addon_options (label, hours, price, sort_order, is_active) VALUES
('1 Additional Hour', 1, 50.00, 1, true),
('2 Additional Hours', 2, 100.00, 2, true),
('3 Additional Hours', 3, 150.00, 3, true),
('4+ Additional Hours', 4, 200.00, 4, true);

-- Populate Location Options (from Google Form - Sonoma County wineries and venues)
DELETE FROM form_location_options;
INSERT INTO form_location_options (label, location_type, city, notes, sort_order, is_active) VALUES
('Kendall Jackson (Santa Rosa)', 'winery', 'Santa Rosa', 'Beautiful gardens, permission required', 1, true),
('Macaron (Healdsburg)', 'winery', 'Healdsburg', 'Vineyard views', 2, true),
('Rodney Strong (Healdsburg)', 'winery', 'Healdsburg', 'Amphitheater and lawn areas', 3, true),
('Paradise Ridge (Santa Rosa)', 'winery', 'Santa Rosa', 'Sculpture grove, hilltop views', 4, true),
('Kunde (Kenwood)', 'winery', 'Kenwood', 'Estate grounds', 5, true),
('Francis Ford Coppola (Geyserville)', 'winery', 'Geyserville', 'Pool area available, advance booking', 6, true),
('Benziger (Glen Ellen)', 'winery', 'Glen Ellen', 'Biodynamic vineyard tours', 7, true),
('Chateau St. Jean (Kenwood)', 'winery', 'Kenwood', 'Chateau grounds', 8, true),
('Iron Horse (Sebastopol)', 'winery', 'Sebastopol', 'Scenic vineyard setting', 9, true),
('Sonoma Plaza', 'park', 'Sonoma', 'Public park, permit may be required', 10, true),
('Spring Lake Park', 'park', 'Santa Rosa', 'Lakeside picnic areas', 11, true),
('Private Home/Backyard', 'home', NULL, 'Client provides location', 12, true),
('Other Venue', 'venue', NULL, 'Please specify in notes', 13, true);
