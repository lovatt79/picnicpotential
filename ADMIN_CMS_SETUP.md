# Admin CMS Setup Guide

## Overview

Your Picnic Potential website now has a complete Content Management System (CMS) that allows you to edit ALL content on the website without touching code.

## What You Can Edit

### Through Admin Panel (`/admin/login`):

1. **Homepage Content** (`/admin/pages/homepage`)
   - Hero section (title, subtitle, description, CTA button)
   - Featured section
   - About preview
   - Bottom CTA section

2. **Services** (`/admin/services`)
   - Add/edit/delete service packages
   - Set pricing, descriptions, features

3. **Seating Options** (`/admin/seating`)
   - Manage different seating styles
   - Add photos and descriptions

4. **Partners** (`/admin/partners`)
   - Vendor partners
   - Winery partners (separate section)

5. **Testimonials** (`/admin/testimonials`)
   - Customer reviews
   - Reorder with drag-and-drop

6. **FAQs** (`/admin/faqs`)
   - Add/edit frequently asked questions

7. **Form Options** (`/admin/form-options`)
   - Edit dropdown options in the service request form
   - Event types, colors, food options, etc.

8. **Submissions** (`/admin/submissions`)
   - View form submissions
   - Mark as pending/contacted/completed/cancelled

9. **Site Settings** (`/admin/settings`)
   - Contact information
   - Social media links
   - Business hours

## Setup Instructions

### Step 1: Run the Page Content Migration

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**
5. Open the file `supabase-page-content-migration.sql` from your project folder
6. Copy ALL the contents
7. Paste into the Supabase SQL Editor
8. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
9. Wait for "Success" message

This will create new tables for:
- `homepage_content` - Homepage text and settings
- `about_page_content` - About page content
- `team_members` - Team member profiles
- `page_content` - Flexible content for other pages
- `feature_cards` - Homepage feature cards
- `photo_albums` & `album_photos` - Photo galleries
- `media` - Image library

### Step 2: Create Image Storage Bucket

1. In Supabase dashboard, go to **Storage** in the left sidebar
2. Click **New Bucket**
3. Name it: `images`
4. Make it **Public** (check the box)
5. Click **Create Bucket**

This is where all uploaded images will be stored.

### Step 3: Create Your Admin User

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your email and password
4. Click **Create User**

### Step 4: Deploy to Vercel

The environment variables should already be set. Once the latest code is deployed:

1. Visit: https://picnicpotential-vw7j.vercel.app/admin/login
2. Log in with the credentials you created in Step 3
3. You should see the admin dashboard!

## How to Edit Content

### Editing the Homepage

1. Log into `/admin/login`
2. Click **Edit Homepage** in the sidebar
3. Edit any text fields
4. Click **Save Changes**
5. Visit your homepage to see the changes live!

### Adding Images (Coming Soon)

The next phase will add:
- Image upload button for hero backgrounds
- Photo gallery management
- Logo upload
- Banner images for each page

## Current Limitations

**Images**: For now, images are still hardcoded in `/public/images/`. The migration has set up the database tables for image management, but we still need to:
1. Build the image upload UI component
2. Connect it to Supabase Storage
3. Update the frontend pages to load images from the database

**Other Pages**: Homepage editing is complete. We can add editors for:
- About page
- Services page intro text
- Seating page intro text
- Any other page content you want to manage

## Next Steps

Would you like me to:
1. **Add image upload functionality** - So you can upload and manage photos through the admin panel
2. **Create editors for other pages** - About page, Services intro, etc.
3. **Add a photo gallery manager** - For organizing event photos into albums
4. **Build a blog/news section** - For announcements and news

Let me know what's most important to you!

## Troubleshooting

### Can't log in to admin
- Make sure you created a user in Supabase Authentication
- Check that the environment variables are set in Vercel
- Try logging out and back in

### Homepage editor shows "No content found"
- Make sure you ran the `supabase-page-content-migration.sql` migration
- Check the Supabase dashboard → Table Editor → `homepage_content` table should have 1 row

### Changes don't appear on the live site
- After saving, refresh the homepage (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
- Check that the changes saved (go back to the editor and see if they're there)
- If using Vercel, it might take a minute for the cache to clear

## File Structure

```
src/
├── app/
│   ├── admin/
│   │   ├── pages/
│   │   │   └── homepage/
│   │   │       └── page.tsx          # Homepage editor
│   │   ├── services/                 # Services CRUD
│   │   ├── seating/                  # Seating CRUD
│   │   ├── partners/                 # Partners CRUD
│   │   ├── testimonials/             # Testimonials CRUD
│   │   ├── faqs/                     # FAQs CRUD
│   │   ├── wineries/                 # Wineries CRUD
│   │   ├── form-options/             # Form dropdowns
│   │   ├── submissions/              # Form submissions
│   │   ├── settings/                 # Site settings
│   │   └── login/                    # Login page
│   └── page.tsx                      # Homepage (will pull from database)
├── components/
│   └── admin/
│       └── AdminSidebar.tsx          # Admin navigation
└── lib/
    └── supabase/
        ├── client.ts                 # Browser Supabase client
        ├── server.ts                 # Server Supabase client
        └── middleware.ts             # Auth middleware
```

## Database Schema

See `supabase-page-content-migration.sql` for the complete schema including:
- All tables and columns
- Indexes for performance
- Row Level Security policies
- Triggers for auto-updating timestamps
- Default data
