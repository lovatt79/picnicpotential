-- Partner page detail content tables
CREATE TABLE IF NOT EXISTS partner_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id UUID UNIQUE REFERENCES vendor_partners(id) ON DELETE CASCADE,

  -- About section
  about_text TEXT,
  services_offered TEXT,

  -- Contact information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),

  -- Gallery section
  gallery_section_title VARCHAR(255) DEFAULT 'Gallery',
  gallery_section_description TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery images for partner pages
CREATE TABLE IF NOT EXISTS partner_gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_page_id UUID REFERENCES partner_pages(id) ON DELETE CASCADE,
  image_id UUID REFERENCES media(id) ON DELETE CASCADE,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_partner_pages_partner_id ON partner_pages(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_gallery_page_id ON partner_gallery_images(partner_page_id);
CREATE INDEX IF NOT EXISTS idx_partner_gallery_image_id ON partner_gallery_images(image_id);
CREATE INDEX IF NOT EXISTS idx_partner_gallery_sort ON partner_gallery_images(sort_order);

-- Disable RLS for now
ALTER TABLE partner_pages DISABLE ROW LEVEL SECURITY;
ALTER TABLE partner_gallery_images DISABLE ROW LEVEL SECURITY;
