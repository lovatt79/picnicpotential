export interface ServiceSection {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeatingSection {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  image_id?: string | null;
  description: string | null;
  long_description: string | null;
  sort_order: number;
  is_published: boolean;
  section_id: string | null;
  external_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SeatingOption {
  id: string;
  title: string;
  image_url: string | null;
  image_id?: string | null;
  description: string;
  sort_order: number;
  is_published: boolean;
  section_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartnerSection {
  id: string;
  title: string;
  description: string | null;
  badge_label: string | null;
  badge_style: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface VendorPartner {
  id: string;
  name: string;
  category: string;
  location: string | null;
  url: string | null;
  website: string | null;
  instagram: string | null;
  description: string | null;
  logo_url: string | null;
  logo_id: string | null;
  partner_type: "VIP" | "Preferred" | "Winery";
  section_id: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  rating: number | null;
  review_date: string | null;
  show_on_homepage: boolean;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormEventType {
  id: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FormColorOption {
  id: string;
  label: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FormFoodOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  min_quantity: number;
  is_vegan: boolean;
  is_gluten_free: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FormDessertOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  min_quantity: number;
  is_vegan: boolean;
  is_gluten_free: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FormAddonOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FormOccasionOption {
  id: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface FormHearAboutOption {
  id: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export type SubmissionStatus = "new" | "contacted" | "quoted" | "confirmed" | "completed" | "cancelled";

export interface FormSubmission {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  event_date: string | null;
  backup_date: string | null;
  event_type: string | null;
  event_time: string | null;
  additional_time: string | null;
  city: string | null;
  exact_location: string | null;
  group_size: string | null;
  guest_names: string | null;
  occasion: string | null;
  color_choice_1: string | null;
  color_choice_1_other: string | null;
  color_choice_2: string | null;
  color_choice_2_other: string | null;
  food_options: string[];
  dessert_options: string[];
  dessert_other: string | null;
  addon_options: string[];
  how_did_you_hear: string | null;
  how_did_you_hear_other: string | null;
  referred_by: string | null;
  notes: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

// ─── Wedding Suite Types ────────────────────────────────────

export interface WsPackageOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface WsFoodOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface WsAddonOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface WsGiftOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface WsSubmission {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  couple_name_1: string | null;
  couple_name_2: string | null;
  venue_name: string | null;
  venue_address: string | null;
  venue_contact_name: string | null;
  venue_contact_email: string | null;
  venue_contact_phone: string | null;
  event_date: string | null;
  arrival_time: string | null;
  suite_access_time: string | null;
  people_count: string | null;
  package: string | null;
  food_options: { label: string; quantity?: number; price?: number | null }[];
  addon_options: { label: string; price: number | null }[];
  gift_options: { label: string; price: number | null }[];
  swap_request: string | null;
  how_did_you_hear: string | null;
  how_did_you_hear_other: string | null;
  notes: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  parent_id: string | null;
  sort_order: number;
  is_published: boolean;
  open_in_new_tab: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Collection Page Types ─────────────────────────────────

export interface CollectionSection {
  id: string;
  collection_page_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionPage {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  hero_subtitle: string | null;
  hero_image_id: string | null;
  meta_description: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CollectionPageItem {
  id: string;
  collection_page_id: string;
  section_id: string | null;
  item_type: 'service' | 'partner';
  service_id: string | null;
  partner_id: string | null;
  custom_title: string | null;
  custom_description: string | null;
  is_coming_soon: boolean;
  sort_order: number;
  created_at: string;
}

// ─── Proposal Types ──────────────────────────────────────

export interface PropPackageOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PropAddonOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PropFoodOption {
  id: string;
  label: string;
  description: string | null;
  price: number | null;
  price_unit: string | null;
  category: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProposalSubmission {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  proposee_name: string | null;
  proposal_date_1: string | null;
  proposal_date_2: string | null;
  proposal_time: string | null;
  location: string | null;
  colors: string | null;
  package: string | null;
  addon_options: { label: string; price?: number | null }[];
  food_options: { label: string; price?: number | null }[];
  notes: string | null;
  how_did_you_hear: string | null;
  how_did_you_hear_other: string | null;
  status: SubmissionStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Builder Page Types ──────────────────────────────────

export type { BuilderPage, BuilderContainer, BuilderColumn, BuilderElement, ColumnLayout, ElementType } from "@/lib/builder-types";
