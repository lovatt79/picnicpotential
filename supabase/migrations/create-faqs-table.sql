-- Create faqs table
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with existing hardcoded FAQs
INSERT INTO faqs (question, answer, is_published, sort_order) VALUES
  ('Where do you provide services?', 'We serve Sonoma County and the surrounding wine country areas including Petaluma, Santa Rosa, Healdsburg, Windsor, and more. We are happy to discuss locations outside of our standard service area.', true, 0),
  ('How far in advance should I book?', 'We recommend booking at least 2-3 weeks in advance, especially during peak season (May-October). For large events or popular dates, we suggest booking even earlier to ensure availability.', true, 1),
  ('What happens if it rains?', 'We monitor the weather closely leading up to your event. If rain is expected, we will work with you to find an alternate date or discuss covered venue options. Your experience and safety are our top priority.', true, 2),
  ('Can I customize my setup?', 'Absolutely! We love working with clients to create a personalized experience. You can select your color palette, add florals, food, and other special touches through our Service Request Form. If there is something specific you have in mind, let us know in the notes section.', true, 3),
  ('What is included in a standard picnic setup?', 'All picnics include ground cover, cushions, table, disposable place settings, wine goblets, and table decor. Additional items such as florals, food, and premium tableware can be added through our Service Request Form.', true, 4),
  ('Do you provide food and drinks?', 'We partner with amazing local vendors who provide charcuterie boards, baked goods, and other food options. These can be added to your order through our Service Request Form. We handle all coordination, setup, and pickup with our vendor partners.', true, 5),
  ('How long does a typical setup last?', 'Standard picnic setups are typically reserved for 2-3 hours. Extended reservations are available upon request. We arrive early to set up and return after your event to handle all cleanup.', true, 6),
  ('What is your cancellation policy?', 'Please contact us directly for details about our cancellation and rescheduling policy. We understand that plans change and we do our best to accommodate our clients.', true, 7);

-- Disable RLS for development
ALTER TABLE faqs DISABLE ROW LEVEL SECURITY;
