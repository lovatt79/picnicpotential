# Image Upload Troubleshooting Guide

## Error: "new row violates row-level security policy"

This error occurs when the Supabase Row Level Security (RLS) policies are blocking the image upload.

### Quick Fix:

1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy and run** the contents of `supabase-fix-rls-policies.sql`
3. You should see "Success" message
4. **Try uploading an image again**

### What This Does:

The script updates the RLS policies on the `media` table to allow:
- ✅ Anyone to READ images (public access)
- ✅ Authenticated users to INSERT new images
- ✅ Authenticated users to UPDATE image metadata
- ✅ Authenticated users to DELETE images

## Other Common Issues:

### 1. Storage Bucket Doesn't Exist

**Error:** `Bucket not found`

**Fix:**
1. Go to Supabase → **Storage**
2. Click **New Bucket**
3. Name: `images`
4. **Check** "Public bucket"
5. Click **Create Bucket**

### 2. Storage Bucket Not Public

**Error:** `Images don't load after upload`

**Fix:**
1. Go to Supabase → **Storage** → `images` bucket
2. Click bucket settings (gear icon)
3. Make sure **"Public bucket"** is enabled
4. Save changes

### 3. File Too Large

**Error:** `File size exceeds limit`

**Fix:**
- Hero images: Max 10MB
- About images: Max 5MB
- Compress your images before uploading
- Use tools like TinyPNG or JPEGmini

### 4. Invalid Image Format

**Error:** `Invalid file type`

**Fix:**
- Accepted formats: JPG, PNG, GIF, WebP
- Make sure file has proper extension (.jpg, .png, etc.)

### 5. Not Logged In

**Error:** `Authentication required`

**Fix:**
1. Make sure you're logged into `/admin/login`
2. Check that your session hasn't expired
3. Try logging out and back in

## Testing Image Upload:

### Step-by-Step Test:

1. **Login to Admin:**
   - Go to `/admin/login`
   - Enter your credentials

2. **Navigate to Homepage Editor:**
   - Click "Edit Homepage" in sidebar

3. **Upload Hero Image:**
   - Scroll to "Hero Background Image" section
   - Click the upload area
   - Select an image (JPG or PNG, under 10MB)
   - Wait for upload (you'll see a spinner)
   - Preview should appear

4. **Save Changes:**
   - Click "Save Changes" at bottom
   - You should see "Homepage content updated successfully!"

5. **View Live Site:**
   - Open your homepage in a new tab
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Your hero image should appear as background!

## Verifying Setup:

### Check Supabase Storage:

1. Go to **Supabase Dashboard** → **Storage** → `images` bucket
2. You should see uploaded files listed
3. Click on a file to see its public URL

### Check Media Table:

1. Go to **Supabase Dashboard** → **Table Editor** → `media` table
2. You should see entries for each uploaded image
3. Check that `url`, `filename`, `size_bytes` are populated

### Check Homepage Content:

1. Go to **Table Editor** → `homepage_content` table
2. Check `hero_image_id` field
3. It should have a UUID value matching an entry in `media` table

## Recommended Image Specs:

### Hero Background Image:
- **Aspect Ratio:** 16:6 or 16:9 (wide landscape)
- **Resolution:** 1920x720px or higher
- **Format:** JPG (best for photos)
- **Size:** 500KB - 2MB (compressed)
- **Subject:** Centered or rule-of-thirds composition
- **Tip:** Dark or blurred backgrounds work best with white text

### About Preview Image:
- **Aspect Ratio:** 4:3 or 16:9
- **Resolution:** 800x600px or higher
- **Format:** JPG or PNG
- **Size:** 200KB - 1MB
- **Subject:** Clear, professional photo

## Browser Console Debugging:

If uploads still fail:

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Try uploading again
4. Look for error messages
5. Common errors:
   - CORS issues → Check Supabase CORS settings
   - 401 Unauthorized → RLS policy issue
   - 404 Not Found → Bucket doesn't exist
   - Network error → Check internet connection

## Still Having Issues?

If image uploads still don't work after trying the above:

1. **Check Environment Variables in Vercel:**
   - `NEXT_PUBLIC_SUPABASE_URL` set correctly
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly

2. **Verify Admin User:**
   - User exists in Supabase Authentication
   - User can log in successfully
   - Session is active (check cookies in DevTools)

3. **Check Supabase Logs:**
   - Go to Supabase Dashboard → Logs
   - Look for errors during upload attempts

4. **Try Direct Upload Test:**
   - Go to Supabase → Storage → `images` bucket
   - Try uploading a file directly in the dashboard
   - If this fails, it's a Supabase configuration issue
