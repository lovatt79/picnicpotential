-- Picnic Potential CMS Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- SERVICES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    description TEXT,
    long_description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- SEATING OPTIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS seating_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    image_url TEXT,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- VENDOR PARTNERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS vendor_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    url TEXT,
    logo_url TEXT,
    partner_type VARCHAR(20) CHECK (partner_type IN ('VIP', 'Preferred')) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- WINERY PARTNERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS winery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TESTIMONIALS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FAQS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FORM OPTION TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS form_event_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_color_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_food_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    price_unit VARCHAR(50),
    min_quantity INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_dessert_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    price_unit VARCHAR(50),
    min_quantity INTEGER DEFAULT 1,
    is_vegan BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_addon_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    price_unit VARCHAR(50),
    category VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_occasion_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS form_hear_about_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label VARCHAR(255) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- FORM SUBMISSIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    event_date DATE,
    backup_date DATE,
    event_type VARCHAR(100),
    event_time TIME,
    additional_time VARCHAR(100),
    city VARCHAR(255),
    exact_location TEXT,
    group_size VARCHAR(50),
    guest_names TEXT,
    occasion VARCHAR(100),
    color_choice_1 VARCHAR(255),
    color_choice_1_other TEXT,
    color_choice_2 VARCHAR(255),
    color_choice_2_other TEXT,
    food_options JSONB DEFAULT '[]',
    dessert_options JSONB DEFAULT '[]',
    dessert_other TEXT,
    addon_options JSONB DEFAULT '[]',
    how_did_you_hear VARCHAR(255),
    how_did_you_hear_other TEXT,
    referred_by VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- SITE SETTINGS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
('site_name', 'Picnic Potential', 'Website name'),
('site_tagline', 'A truly unique picnic and event experience', 'Site tagline'),
('contact_email', 'Info@picnicpotential.com', 'Primary contact email'),
('instagram_url', 'https://www.instagram.com/picnic.potential/', 'Instagram profile URL'),
('facebook_url', 'https://www.facebook.com/picnicpotential', 'Facebook page URL'),
('pinterest_url', 'https://www.pinterest.com/PicnicPotential/', 'Pinterest profile URL'),
('tiktok_url', 'https://www.tiktok.com/@picnicpotential', 'TikTok profile URL')
ON CONFLICT (key) DO NOTHING;

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published);
CREATE INDEX IF NOT EXISTS idx_seating_sort ON seating_options(sort_order);
CREATE INDEX IF NOT EXISTS idx_vendor_type ON vendor_partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_testimonials_published ON testimonials(is_published);
CREATE INDEX IF NOT EXISTS idx_faqs_sort ON faqs(sort_order);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_date ON form_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_event_date ON form_submissions(event_date);

-- ==========================================
-- TRIGGERS for updated_at
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_seating_updated_at ON seating_options;
CREATE TRIGGER update_seating_updated_at BEFORE UPDATE ON seating_options FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_vendors_updated_at ON vendor_partners;
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendor_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_wineries_updated_at ON winery_partners;
CREATE TRIGGER update_wineries_updated_at BEFORE UPDATE ON winery_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_faqs_updated_at ON faqs;
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS update_submissions_updated_at ON form_submissions;
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON form_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE seating_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE winery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_color_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_food_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_dessert_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_addon_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_occasion_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_hear_about_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Content tables: Public read (published only), authenticated users can do everything
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view published seating" ON seating_options FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage seating" ON seating_options FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view published partners" ON vendor_partners FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage partners" ON vendor_partners FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view published wineries" ON winery_partners FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage wineries" ON winery_partners FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view published faqs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- Form options: Public read (active only), authenticated users can manage
CREATE POLICY "Public can view active event types" ON form_event_types FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage event types" ON form_event_types FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active color options" ON form_color_options FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage color options" ON form_color_options FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active food options" ON form_food_options FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage food options" ON form_food_options FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active dessert options" ON form_dessert_options FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage dessert options" ON form_dessert_options FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active addon options" ON form_addon_options FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage addon options" ON form_addon_options FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active occasion options" ON form_occasion_options FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage occasion options" ON form_occasion_options FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view active hear about options" ON form_hear_about_options FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can manage hear about options" ON form_hear_about_options FOR ALL USING (auth.role() = 'authenticated');

-- Form submissions: Public can insert, authenticated users can view/update
CREATE POLICY "Anyone can submit forms" ON form_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can view submissions" ON form_submissions FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update submissions" ON form_submissions FOR UPDATE USING (auth.role() = 'authenticated');

-- Site settings: Public read, authenticated users can update
CREATE POLICY "Public can view settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- STORAGE BUCKET (run in Supabase Dashboard > Storage)
-- ==========================================
-- Create a bucket called "public-images" with public access
-- Then add policies:
-- 1. Allow public read access
-- 2. Allow authenticated users to upload/update/delete
