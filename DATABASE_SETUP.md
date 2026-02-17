# Database Setup Instructions

## Run These SQL Migrations in Supabase

Go to your Supabase Dashboard → SQL Editor and run these in order:

### 1. Add image_id to services table

```sql
-- Add image_id column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS image_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_services_image_id ON services(image_id);
```

### Testing the Setup

After running the migration:

1. Go to `/admin/services`
2. Click "Edit" on any service
3. Upload an image using the ImageUpload component
4. Click "Save Changes"
5. Visit `/services/[slug]` (e.g., `/services/birthday-picnics`) to see the live page

### Features Now Available

✅ **Image Upload for Services**
- Admin can upload images directly from the service editor
- Images are stored in Supabase Storage
- Automatic linking via `image_id` foreign key

✅ **Dynamic Service Detail Pages**
- Each service has its own page at `/services/[slug]`
- Displays service title, description, and uploaded image
- Includes CTA to request the service

✅ **Homepage Integration**
- Services automatically pulled from database
- Service cards link to detail pages
- Images display from Supabase Storage

### Database Schema

```
services table:
- id (UUID, primary key)
- title (VARCHAR)
- slug (VARCHAR, unique)
- description (TEXT)
- long_description (TEXT)
- image_url (VARCHAR) - legacy fallback
- image_id (UUID) - NEW! Links to media table
- is_published (BOOLEAN)
- sort_order (INTEGER)
- created_at, updated_at (TIMESTAMP)

media table:
- id (UUID, primary key)
- filename (VARCHAR)
- url (VARCHAR)
- file_size (INTEGER)
- mime_type (VARCHAR)
- created_at (TIMESTAMP)
```

### Notes

- The `image_url` field is kept for backward compatibility
- If both `image_id` and `image_url` exist, `image_id` takes priority
- Images uploaded through the admin panel are stored in Supabase Storage bucket "images"
