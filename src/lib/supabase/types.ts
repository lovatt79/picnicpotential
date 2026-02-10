export interface Service {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  description: string | null;
  long_description: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SeatingOption {
  id: string;
  title: string;
  image_url: string | null;
  description: string;
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
  logo_url: string | null;
  partner_type: "VIP" | "Preferred";
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface WineryPartner {
  id: string;
  name: string;
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
