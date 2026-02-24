"use client";

import { useState, useMemo, useEffect, useRef } from "react";

// ─── Data Types ────────────────────────────────────────────

interface HelpStep {
  text?: string;
  tip?: string;
}

interface HelpArticle {
  id: string;
  title: string;
  keywords: string[];
  steps: HelpStep[];
}

interface HelpCategory {
  id: string;
  title: string;
  icon: string;
  articles: HelpArticle[];
}

// ─── Knowledge Base Content ────────────────────────────────

const KNOWLEDGE_BASE: HelpCategory[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: "🏠",
    articles: [
      {
        id: "dashboard-overview",
        title: "Understanding the Dashboard",
        keywords: ["dashboard", "home", "overview", "stats", "submissions"],
        steps: [
          { text: "The dashboard is your admin home page. It shows six stat cards: Services, Seating Options, Partners, Testimonials, FAQs, and New Submissions." },
          { text: "Click any stat card to navigate directly to that section." },
          { text: "The Quick Actions panel on the left provides shortcuts to add new Services, Testimonials, FAQs, or view Submissions." },
          { text: "The Recent Submissions panel on the right shows your 5 latest service requests with color-coded status badges." },
          { tip: "New submissions appear with a gold badge. Check this panel regularly to stay on top of incoming requests." },
        ],
      },
    ],
  },
  {
    id: "pages",
    title: "Pages",
    icon: "📄",
    articles: [
      {
        id: "homepage-hero",
        title: "Editing the Homepage Hero",
        keywords: ["homepage", "hero", "title", "subtitle", "CTA", "background", "image"],
        steps: [
          { text: "Navigate to Pages → Homepage in the sidebar." },
          { text: "In the Hero Section card, edit the Hero Title, Hero Subtitle, and Hero Description." },
          { text: "Set the CTA Button Text (e.g., \"Book Now\") and CTA Button Link (e.g., /request)." },
          { text: "Upload a Hero Background Image using \"Upload Image\" or \"Choose from Library\"." },
          { text: "Click \"Save Changes\" at the bottom of the section." },
          { tip: "The hero image should be high-resolution (at least 1920px wide) for the best display across screen sizes." },
        ],
      },
      {
        id: "homepage-featured",
        title: "Managing Homepage Featured Section",
        keywords: ["homepage", "featured", "why choose", "section"],
        steps: [
          { text: "On the Homepage editor, scroll down to the \"Featured Section\" card." },
          { text: "Edit the Section Title (e.g., \"Why Choose Picnic Potential?\") and optional Section Subtitle." },
          { text: "Click \"Save Changes\"." },
          { tip: "This section displays on the homepage below the hero. Keep the title concise and inviting." },
        ],
      },
      {
        id: "homepage-about-preview",
        title: "Editing the About Preview on Homepage",
        keywords: ["homepage", "about", "preview", "image"],
        steps: [
          { text: "In the Homepage editor, scroll to \"About Preview Section\"." },
          { text: "Set the preview Title and Text that introduces your brand." },
          { text: "Upload an About Preview Image." },
          { text: "Click \"Save Changes\"." },
        ],
      },
      {
        id: "homepage-cta",
        title: "Homepage CTA Section",
        keywords: ["homepage", "CTA", "call to action", "button", "bottom"],
        steps: [
          { text: "Scroll to \"Bottom CTA Section\" in the Homepage editor." },
          { text: "Edit the CTA Title and Subtitle." },
          { text: "Set the Button Text and Button Link." },
          { text: "Click \"Save Changes\"." },
          { tip: "This CTA appears at the bottom of the homepage. Use action-oriented text like \"Start Planning Your Event\"." },
        ],
      },
      {
        id: "about-hero",
        title: "Editing the About Page Hero",
        keywords: ["about", "hero", "page hero", "banner"],
        steps: [
          { text: "Navigate to Pages → About in the sidebar." },
          { text: "The Hero Editor component appears at the top of the page." },
          { text: "Set the hero Title and Description." },
          { text: "Upload a background image (recommended: 16:6 aspect ratio, up to 10MB)." },
          { text: "Optionally check \"Show CTA Button\" to add a call-to-action with custom text and link." },
          { text: "Click \"Save Hero Settings\"." },
        ],
      },
      {
        id: "about-story",
        title: "Managing Our Story Section",
        keywords: ["about", "our story", "story", "image", "service area"],
        steps: [
          { text: "On the About page editor, scroll below the Hero Editor to \"Page Content\"." },
          { text: "Edit \"Our Story Title\" and \"Our Story Text\" — this is your brand narrative." },
          { text: "Upload an image using the \"Our Story Image\" uploader." },
          { text: "Set the \"Features Section Title\" and \"Service Area\" description." },
          { text: "Click \"Save Content\"." },
        ],
      },
      {
        id: "about-features",
        title: "Managing About Page Features",
        keywords: ["about", "features", "icons", "add feature"],
        steps: [
          { text: "Scroll to the \"Features\" section at the bottom of the About page editor." },
          { text: "Click \"Add Feature\" to create a new feature item." },
          { text: "For each feature: set a Title, choose an Icon from the dropdown (40+ emoji options), write a Description, and set a Sort Order." },
          { text: "Click \"Save Feature\" on each card to save." },
          { text: "Use the \"Delete\" button to remove features you no longer need." },
          { tip: "Features display in a grid on the public About page. Use clear, concise titles and choose icons that match the topic." },
        ],
      },
    ],
  },
  {
    id: "services",
    title: "Services",
    icon: "📦",
    articles: [
      {
        id: "service-create",
        title: "Creating a New Service",
        keywords: ["service", "create", "new", "add"],
        steps: [
          { text: "Navigate to Content → Services in the sidebar." },
          { text: "Click the \"Add New Service\" button in the top-right." },
          { text: "Fill in the required Title — the URL Slug auto-generates from the title." },
          { text: "Complete optional fields like description, section assignment, and card image." },
          { text: "Click \"Create Service\" to save. You'll be redirected to the full editor." },
          { tip: "Services without a section assignment are \"uncategorized\" and won't appear on the public Services page — they can only be added to Collection pages." },
        ],
      },
      {
        id: "service-basic-info",
        title: "Service Basic Info Tab",
        keywords: ["service", "basic", "title", "slug", "publish", "external URL", "section", "image", "thumbnail"],
        steps: [
          { text: "Open any service and go to the \"Basic Info\" tab (the default tab)." },
          { text: "Edit the Title and URL Slug (appears as /services/your-slug on the public site)." },
          { text: "Write a Short Description — this appears on service cards and in search results." },
          { text: "Set a Sort Order number to control display positioning (lower numbers appear first)." },
          { text: "Choose a Section from the dropdown to categorize this service on the Services page." },
          { text: "Optionally set an External URL — if set, the service card will link to this URL instead of the service detail page." },
          { text: "Upload a Service Card Image (16:9 ratio recommended). This is the thumbnail shown on cards and the default hero image." },
          { text: "Toggle the Published switch to control visibility." },
          { text: "Click \"Save Basic Info\"." },
        ],
      },
      {
        id: "service-page-content",
        title: "Service Page Content Tab",
        keywords: ["service", "page content", "hero", "intro", "CTA", "features section", "gallery section", "subtitle"],
        steps: [
          { text: "Switch to the \"Page Content\" tab." },
          { text: "Hero Section: Set a Hero Subtitle (displayed below the title in the hero banner) and optionally upload a Hero Image (21:9 ratio) that overrides the card image on the detail page." },
          { text: "Intro Section: Write detailed Intro Text — this is the main descriptive paragraph visitors see first." },
          { text: "Features Section: Customize the section title (defaults to \"What's Included\") and add an optional description above the features grid." },
          { text: "Gallery Section: Customize the gallery section title (defaults to \"Gallery\") and add an optional description." },
          { text: "CTA Section: Set a call-to-action title, description, button text, and button link (e.g., /request)." },
          { text: "Click \"Save Page Content\"." },
          { tip: "The Intro Text supports line breaks — press Enter to create paragraphs. This is the most important text on the service detail page." },
        ],
      },
      {
        id: "service-features",
        title: "Managing Service Features",
        keywords: ["service", "features", "what's included", "icon", "reorder", "add", "delete"],
        steps: [
          { text: "Switch to the \"Features\" tab." },
          { text: "Click \"+ Add Feature\" to open the feature editor." },
          { text: "Enter a Title (e.g., \"Mimosa Bar\"), a Description, and select an Icon from 40+ emoji options." },
          { text: "Click \"Save\" to add the feature." },
          { text: "Features appear as cards. Click \"Edit\" to modify or \"Delete\" to remove." },
          { text: "Set the Sort Order on each feature to control the display order on the public page." },
          { tip: "Features display as a responsive grid on the service detail page. Each feature shows its emoji icon, title, and description." },
        ],
      },
      {
        id: "service-gallery",
        title: "Managing the Service Gallery",
        keywords: ["service", "gallery", "images", "caption", "photos"],
        steps: [
          { text: "Switch to the \"Gallery\" tab." },
          { text: "Use \"Add Gallery Image\" to upload a new photo or choose from the media library." },
          { text: "Images appear in a 3-column grid." },
          { text: "Add captions by typing in the text field below each image — captions auto-save when you click away." },
          { text: "Click \"Delete\" on any image to remove it from the gallery." },
          { tip: "Gallery images display on the service detail page in a responsive grid with a hover zoom effect. Use high-quality, well-lit photos." },
        ],
      },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    icon: "🗂️",
    articles: [
      {
        id: "collection-create",
        title: "Creating a Collection Page",
        keywords: ["collection", "create", "curated", "group", "page"],
        steps: [
          { text: "Navigate to Content → Collections in the sidebar." },
          { text: "Click \"Add Collection\" in the top-right." },
          { text: "Fill in the Title and URL Slug — the collection will be accessible at /your-slug." },
          { text: "Write a Description and Hero Subtitle." },
          { text: "Upload a Hero Image for the collection page banner." },
          { text: "Toggle Published to control visibility." },
          { text: "Click \"Save\"." },
          { tip: "Collections are standalone pages that group services and/or partners into curated packages — great for wedding suites, corporate events, or seasonal offerings." },
        ],
      },
      {
        id: "collection-items",
        title: "Managing Collection Items & Sections",
        keywords: ["collection", "items", "sections", "drag", "reorder", "coming soon", "add", "remove"],
        steps: [
          { text: "Open a collection from the collections list." },
          { text: "The left panel shows current items organized by section. The right panel is a picker for adding new items." },
          { text: "Click \"+ Add Section\" to create named sections (e.g., \"Picnic Packages\", \"Add-Ons\")." },
          { text: "In the right panel, switch between the \"Services\" and \"Partners\" tabs to browse available items." },
          { text: "Check the checkbox next to any item to add it to the collection. Uncheck to remove." },
          { text: "Drag items between sections (including \"Uncategorized\") to organize them." },
          { text: "Click the clock icon on any item to toggle \"Coming Soon\" status." },
          { text: "Click the × icon to remove an item from the collection." },
          { text: "Use the section controls (↑↓ arrows, edit pencil, trash) to reorder, rename, or delete sections." },
          { text: "Click \"Save Collection\" to persist all changes." },
          { tip: "Items in the \"Uncategorized\" area appear at the top of the page without a section heading. Named sections display with their title as a heading." },
        ],
      },
    ],
  },
  {
    id: "seating",
    title: "Seating Options",
    icon: "🪑",
    articles: [
      {
        id: "seating-manage",
        title: "Managing Seating Options",
        keywords: ["seating", "styles", "create", "edit", "options"],
        steps: [
          { text: "Navigate to Content → Seating Options in the sidebar." },
          { text: "The Hero Editor at the top controls the public Seating Styles page banner — edit and click \"Save Hero Settings\"." },
          { text: "Click \"Add Seating Option\" to create a new entry." },
          { text: "Each seating option has a title, description, image, and section assignment." },
          { text: "Use the section dropdown to organize seating options into groups on the public page." },
          { text: "Toggle Published to control visibility." },
          { tip: "Seating options display on the public /seating page grouped by section, similar to how services are organized." },
        ],
      },
    ],
  },
  {
    id: "partners",
    title: "Partners",
    icon: "🤝",
    articles: [
      {
        id: "partner-create-edit",
        title: "Creating & Editing Partners",
        keywords: ["partner", "vendor", "VIP", "preferred", "winery", "create", "edit", "logo"],
        steps: [
          { text: "Navigate to Content → Partners in the sidebar." },
          { text: "Click \"Add Partner\" to create a new partner entry." },
          { text: "The partner editor has 3 tabs: Basic Info, Content, and Gallery." },
          { text: "Basic Info: Set the partner Name, Category (e.g., Catering, Florist), Location, and Description. Add their Website URL and Instagram handle. Upload a Logo image. Select a Partner Type (VIP, Preferred, or Winery). Choose a Section to organize them on the partners page." },
          { text: "Content: Set a Hero Image for the partner detail page. List Services Offered. Add Contact Email and Phone." },
          { text: "Gallery: Upload multiple images using the multi-image uploader to showcase the partner's work." },
          { text: "Toggle Published and click \"Save\"." },
          { tip: "VIP partners are highlighted with a special badge on the public site. Use \"Preferred\" for regular partners and \"Winery\" for venue/winery partners." },
        ],
      },
      {
        id: "partner-hero",
        title: "Partners Page Hero",
        keywords: ["partner", "hero", "page", "banner"],
        steps: [
          { text: "On the Partners list page, the Hero Editor at the top controls the public /partners page banner." },
          { text: "Set the title, description, and background image." },
          { text: "Optionally enable a CTA button." },
          { text: "Click \"Save Hero Settings\"." },
        ],
      },
    ],
  },
  {
    id: "testimonials",
    title: "Testimonials",
    icon: "⭐",
    articles: [
      {
        id: "testimonial-add",
        title: "Adding Testimonials",
        keywords: ["testimonial", "review", "add", "create", "rating"],
        steps: [
          { text: "Navigate to Content → Testimonials in the sidebar." },
          { text: "Click \"Add Testimonial\" in the top-right." },
          { text: "Enter the review text in the main text area." },
          { text: "Fill in the Author Name and set a Star Rating (1–5)." },
          { text: "Set the Review Date." },
          { text: "Toggle \"Published\" to show on the testimonials page." },
          { text: "Click \"Save\"." },
        ],
      },
      {
        id: "testimonial-manage",
        title: "Managing Testimonials",
        keywords: ["testimonial", "publish", "homepage", "toggle", "feature"],
        steps: [
          { text: "On the testimonials list, each review has two quick toggles that save instantly." },
          { text: "Published (green toggle): Controls whether the testimonial appears on the /testimonials page." },
          { text: "Homepage (gold toggle): Controls whether the testimonial is featured on the homepage." },
          { text: "Click \"Edit\" to modify the review text, author, rating, or date." },
          { tip: "The dashboard shows a count of \"Homepage\" testimonials. Feature your best reviews to make a strong first impression." },
        ],
      },
      {
        id: "testimonial-hero",
        title: "Testimonials Page Hero",
        keywords: ["testimonial", "hero", "banner"],
        steps: [
          { text: "The Hero Editor at the top of the Testimonials list page controls the public page banner." },
          { text: "Edit the title, description, and background image." },
          { text: "Click \"Save Hero Settings\"." },
        ],
      },
    ],
  },
  {
    id: "faqs",
    title: "FAQs",
    icon: "❓",
    articles: [
      {
        id: "faq-add",
        title: "Adding FAQs",
        keywords: ["FAQ", "question", "answer", "add", "create"],
        steps: [
          { text: "Navigate to Content → FAQs in the sidebar." },
          { text: "Click \"Add FAQ\" in the top-right." },
          { text: "Enter the Question and the Answer." },
          { text: "Toggle \"Published\" to control visibility on the public page." },
          { text: "Set a Sort Order number — lower numbers appear first." },
          { text: "Click \"Save\"." },
        ],
      },
      {
        id: "faq-manage",
        title: "Managing FAQs",
        keywords: ["FAQ", "edit", "publish", "order", "draft"],
        steps: [
          { text: "The FAQs list shows all questions with Published/Draft badges." },
          { text: "Click \"Edit\" on any FAQ to modify the question, answer, or settings." },
          { text: "The Hero Editor at the top of the page controls the /faqs page banner." },
          { tip: "FAQs display in sort order on the public page as an accordion — visitors click to expand each question." },
        ],
      },
    ],
  },
  {
    id: "form-options",
    title: "Form Options",
    icon: "📋",
    articles: [
      {
        id: "form-options-overview",
        title: "Understanding Form Options",
        keywords: ["form options", "dropdown", "request form", "categories", "overview"],
        steps: [
          { text: "Navigate to Forms → Form Options in the sidebar." },
          { text: "This page is the hub for managing all dropdown options across your three request forms." },
          { text: "Service Request Form: 9 option categories (Event Types, Occasions, Colors, Food, Desserts, Add-ons, Additional Time, Locations, Attribution)." },
          { text: "Wedding Suite Form: 4 option categories (Packages, Food & Drinks, Add-ons, Gifts)." },
          { text: "Proposal Form: 3 option categories (Packages, Add-ons, Food & Flowers)." },
          { text: "Click any category card to manage its options." },
          { tip: "When you add, edit, or remove options here, the changes appear immediately in the corresponding public request form." },
        ],
      },
      {
        id: "form-options-service",
        title: "Managing Service Form Options",
        keywords: ["event types", "colors", "food", "desserts", "addons", "time", "locations", "occasions", "attribution"],
        steps: [
          { text: "Under \"Service Request Form\", click any category card to manage its options." },
          { text: "Each option editor lets you add new items with a Label, optional Price, Price Unit (per person, per hour, flat), and Minimum Quantity." },
          { text: "Edit existing options inline — changes save when you click \"Save\"." },
          { text: "Toggle active/inactive to temporarily hide options without deleting them." },
          { text: "Set a Sort Order to control the display sequence in the form dropdown." },
          { tip: "Price information is displayed to customers in the request form. Leave pricing blank for items where you want to quote individually." },
        ],
      },
      {
        id: "form-options-wedding",
        title: "Managing Wedding Suite Form Options",
        keywords: ["wedding", "suite", "packages", "food", "drinks", "addons", "gifts"],
        steps: [
          { text: "Under \"Wedding Suite Form\", manage four categories:" },
          { text: "Packages: Suite packages with pricing tiers (e.g., Suiteheart Space, Serenity Suite, Luxe Haven)." },
          { text: "Food & Drinks: Options like charcuterie, mimosa bar, iced coffee bar, desserts." },
          { text: "Add-ons: Suite essentials, extra decor, neon signs, additional flowers, equipment." },
          { text: "Wedding Party Gifts: Personalized items for the wedding party." },
        ],
      },
      {
        id: "form-options-proposal",
        title: "Managing Proposal Form Options",
        keywords: ["proposal", "packages", "addons", "food", "flowers"],
        steps: [
          { text: "Under \"Proposal Form\", manage three categories:" },
          { text: "Packages: Proposal package tiers (Intimate, Signature, Luxe)." },
          { text: "Add-ons: Umbrella, cabana, neon sign, hurricane vases, and other extras." },
          { text: "Food & Flowers: Sandwich box, charcuterie upgrades, chocolate strawberries, floral bouquets." },
        ],
      },
    ],
  },
  {
    id: "submissions",
    title: "Submissions",
    icon: "📬",
    articles: [
      {
        id: "submissions-view",
        title: "Viewing Submissions",
        keywords: ["submissions", "requests", "view", "filter", "tabs"],
        steps: [
          { text: "Navigate to Forms → Submissions in the sidebar." },
          { text: "Use the tab bar to filter: All Requests, Service Requests, Wedding Suite, or Proposals. Each tab shows a count badge." },
          { text: "The table displays: customer name, request type (color-coded badge), key details, event date, status, and submission date." },
          { text: "Click \"View Details\" to see the full submission with all customer selections and notes." },
          { tip: "New submissions appear on the dashboard's Recent Submissions panel. Check regularly to respond promptly." },
        ],
      },
      {
        id: "submissions-status",
        title: "Managing Submission Status",
        keywords: ["submission", "status", "contacted", "quoted", "confirmed", "completed", "cancelled", "lead"],
        steps: [
          { text: "Open any submission detail page by clicking \"View Details\"." },
          { text: "The status tracks your progress with this lead through these stages:" },
          { text: "New (gold) → Contacted (blue) → Quoted (purple) → Confirmed (green) → Completed (gray). Use Cancelled (red) if the lead doesn't proceed." },
          { text: "Change the status using the dropdown on the detail page. Changes save immediately." },
          { tip: "Use the status system to track your sales pipeline. The dashboard count shows only \"New\" submissions so you know what needs attention." },
        ],
      },
    ],
  },
  {
    id: "media",
    title: "Media Library",
    icon: "🖼️",
    articles: [
      {
        id: "media-upload",
        title: "Uploading Images",
        keywords: ["media", "upload", "image", "library", "photo"],
        steps: [
          { text: "Navigate to Media in the sidebar." },
          { text: "Click the upload area or \"Upload\" button at the top." },
          { text: "Select an image file from your computer (max 5MB)." },
          { text: "The image uploads to storage and appears in the gallery with its filename, dimensions, file size, and upload date." },
          { tip: "Images uploaded here are available across the entire admin via \"Choose from Library\" in any image upload field." },
        ],
      },
      {
        id: "media-browse",
        title: "Using the Media Library",
        keywords: ["media", "search", "browse", "copy URL", "delete", "choose from library"],
        steps: [
          { text: "Browse images in the paginated grid (24 per page)." },
          { text: "Use the search bar to filter by filename." },
          { text: "Click any image to see its details — dimensions, file size, upload date." },
          { text: "Copy the image URL for use elsewhere." },
          { text: "Delete images you no longer need." },
          { text: "When uploading images in other admin sections (services, partners, heroes), you can click \"Choose from Library\" to pick from previously uploaded images instead of uploading again." },
        ],
      },
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    icon: "☰",
    articles: [
      {
        id: "nav-manage",
        title: "Managing Menu Items",
        keywords: ["navigation", "menu", "reorder", "drag", "sub-menu", "indent"],
        steps: [
          { text: "Navigate to Navigation in the sidebar." },
          { text: "All menu items appear in a drag-reorderable list." },
          { text: "Drag items by the handle icon (≡) to reorder them." },
          { text: "Use the indent/outdent arrows to create sub-menu items — indented items become children of the item above them." },
          { text: "Toggle \"Published\" to show or hide menu items." },
          { text: "Click the pencil icon to edit the label and URL." },
          { text: "Click the trash icon to delete a menu item." },
          { tip: "The navigation order here matches exactly what visitors see in the site header. Preview changes by clicking \"View Site\" at the bottom of the sidebar." },
        ],
      },
      {
        id: "nav-create",
        title: "Creating Navigation Items",
        keywords: ["navigation", "add", "create", "link", "menu item"],
        steps: [
          { text: "On the Navigation page, use the add form at the top or bottom." },
          { text: "Enter a Label (the display text visitors see) and a URL (e.g., /services, /partners, or an external URL)." },
          { text: "The new item appears at the bottom of the list." },
          { text: "Drag it to the desired position in your menu." },
        ],
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: "⚙️",
    articles: [
      {
        id: "settings-configure",
        title: "Configuring Site Settings",
        keywords: ["settings", "site name", "tagline", "email", "social", "instagram", "facebook", "pinterest", "tiktok"],
        steps: [
          { text: "Navigate to Settings at the bottom of the sidebar." },
          { text: "Edit the Site Name and Site Tagline — these appear in the site header and footer." },
          { text: "Set the Contact Email — this is displayed on the site for customer inquiries." },
          { text: "Enter social media URLs: Instagram, Facebook, Pinterest, and TikTok." },
          { text: "Click \"Save Settings\". A confirmation message appears briefly." },
          { tip: "Social media links appear as icons in the site footer. Leave any field empty to hide that social icon." },
        ],
      },
    ],
  },
  {
    id: "services-page",
    title: "Services Page Sections",
    icon: "📑",
    articles: [
      {
        id: "services-page-sections",
        title: "Managing Services Page Sections",
        keywords: ["services page", "sections", "community", "corporate", "visibility", "content blocks"],
        steps: [
          { text: "Services can be organized into sections on the public /services page." },
          { text: "Go to Content → Services. The services list is organized by section." },
          { text: "Drag services between sections to reorganize them." },
          { text: "Create new sections using the \"+ Add Section\" button." },
          { text: "Each section has a title that displays as a heading on the public page." },
          { text: "Services without a section (\"Uncategorized\") are hidden from the services page — use this for collection-only services." },
          { tip: "The public Services page displays each section as a separate group with its own heading. Reorganize sections to control the page layout." },
        ],
      },
    ],
  },
  {
    id: "images",
    title: "Images & Uploads",
    icon: "📷",
    articles: [
      {
        id: "image-upload-component",
        title: "Using the Image Upload Component",
        keywords: ["upload", "image", "replace", "remove", "library", "thumbnail", "photo"],
        steps: [
          { text: "Throughout admin, image upload fields offer two options: \"Upload Image\" (select from your computer) and \"Choose from Library\" (browse previously uploaded media)." },
          { text: "After uploading, you see a thumbnail preview of the image." },
          { text: "Use \"Replace\" to swap the current image for a different one." },
          { text: "Use \"Library\" to pick a different image from the media library." },
          { text: "Use \"Remove\" to clear the image entirely." },
          { tip: "Images are stored centrally in Supabase Storage. Uploading the same image in different places doesn't create duplicates — it references the same file." },
        ],
      },
      {
        id: "hero-editor",
        title: "Using the Hero Editor",
        keywords: ["hero", "editor", "page hero", "CTA", "background image", "banner"],
        steps: [
          { text: "Many pages have a Hero Editor at the top (About, Testimonials, FAQs, Partners, Seating)." },
          { text: "Set the hero Title — this is the large heading visitors see in the page banner." },
          { text: "Set the Description — supporting text below the title." },
          { text: "Upload a Background Image (recommended: wide aspect ratio, high resolution)." },
          { text: "Optionally check \"Show CTA Button\" to add a call-to-action button with custom text and link." },
          { text: "Click \"Save Hero Settings\" to apply changes." },
          { tip: "Hero images display full-width with a dark overlay for text readability. Use bright, eye-catching photos for the best impact." },
        ],
      },
    ],
  },
];

// ─── Component ─────────────────────────────────────────────

export default function AdminHelpPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Auto-focus search on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      const timer = setTimeout(() => searchInputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter articles by search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return KNOWLEDGE_BASE;

    const query = searchQuery.toLowerCase().trim();

    return KNOWLEDGE_BASE
      .map((category) => ({
        ...category,
        articles: category.articles.filter(
          (article) =>
            article.title.toLowerCase().includes(query) ||
            article.keywords.some((kw) => kw.toLowerCase().includes(query))
        ),
      }))
      .filter((category) => category.articles.length > 0);
  }, [searchQuery]);

  // Count total matches for search feedback
  const totalMatches = useMemo(
    () => filteredCategories.reduce((sum, cat) => sum + cat.articles.length, 0),
    [filteredCategories]
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleArticle = (articleId: string) => {
    setExpandedArticle((prev) => (prev === articleId ? null : articleId));
  };

  const isCategoryExpanded = (categoryId: string) => {
    // Auto-expand when searching
    if (searchQuery.trim()) return true;
    return expandedCategories.has(categoryId);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSearchQuery("");
    setExpandedArticle(null);
  };

  return (
    <>
      {/* Trigger Button — ? tab on right edge */}
      <button
        onClick={handleOpen}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-l-xl bg-charcoal text-white hover:bg-gold hover:text-charcoal shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Open help panel"
        title="Admin Help"
      >
        <span className="font-serif text-lg font-bold">?</span>
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-96 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
              <span className="font-serif text-charcoal font-bold text-sm">?</span>
            </div>
            <h2 className="font-serif text-xl text-charcoal">Admin Help</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-warm-gray hover:text-charcoal transition-colors"
            aria-label="Close help panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-gray-100 shrink-0">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm text-charcoal placeholder-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs text-warm-gray mt-2">
              {totalMatches} {totalMatches === 1 ? "article" : "articles"} found
            </p>
          )}
        </div>

        {/* Category / Article List */}
        <div className="flex-1 overflow-y-auto">
          {filteredCategories.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-warm-gray text-sm">No articles match your search.</p>
              <p className="text-warm-gray/60 text-xs mt-1">Try different keywords.</p>
            </div>
          ) : (
            filteredCategories.map((category) => (
              <div key={category.id} className="border-b border-gray-100">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-semibold text-charcoal uppercase tracking-wide flex-1">
                    {category.title}
                  </span>
                  <span className="text-xs text-warm-gray/60 mr-2">
                    {category.articles.length}
                  </span>
                  <svg
                    className={`w-4 h-4 text-warm-gray transition-transform duration-200 ${
                      isCategoryExpanded(category.id) ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Articles */}
                {isCategoryExpanded(category.id) && (
                  <div className="pb-1">
                    {category.articles.map((article) => (
                      <div key={article.id}>
                        {/* Article Title */}
                        <button
                          onClick={() => toggleArticle(article.id)}
                          className={`w-full px-6 py-2.5 pl-14 text-left transition-colors text-sm flex items-center gap-2 ${
                            expandedArticle === article.id
                              ? "bg-cream/60 text-charcoal font-medium border-l-2 border-gold"
                              : "text-charcoal/80 hover:bg-sage-light/20 hover:text-charcoal border-l-2 border-transparent"
                          }`}
                        >
                          <svg
                            className={`w-3.5 h-3.5 shrink-0 text-warm-gray transition-transform duration-200 ${
                              expandedArticle === article.id ? "rotate-90" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="flex-1">{article.title}</span>
                        </button>

                        {/* Expanded Article Content */}
                        {expandedArticle === article.id && (
                          <div className="px-6 py-4 pl-14 bg-cream/30 border-l-2 border-gold">
                            <div className="space-y-3">
                              {article.steps.map((step, stepIndex) =>
                                step.tip ? (
                                  // Tip callout
                                  <div
                                    key={stepIndex}
                                    className="flex gap-2 bg-gold/10 rounded-lg px-3 py-2.5 border-l-2 border-gold"
                                  >
                                    <span className="text-sm">💡</span>
                                    <p className="text-xs text-charcoal/80 leading-relaxed">
                                      {step.tip}
                                    </p>
                                  </div>
                                ) : (
                                  // Regular step
                                  <div key={stepIndex} className="flex gap-3">
                                    <span className="w-5 h-5 rounded-full bg-gold text-charcoal text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                      {stepIndex + 1 - article.steps.slice(0, stepIndex).filter(s => s.tip).length}
                                    </span>
                                    <p className="text-sm text-charcoal/80 leading-relaxed">
                                      {step.text}
                                    </p>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 shrink-0">
          <p className="text-[11px] text-warm-gray/60 text-center">
            {KNOWLEDGE_BASE.reduce((sum, cat) => sum + cat.articles.length, 0)} articles across {KNOWLEDGE_BASE.length} categories
          </p>
        </div>
      </div>
    </>
  );
}
