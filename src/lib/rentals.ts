export interface PricingLine {
  label: string;
  price: number;
}

export interface Spec {
  label: string;
  value: string;
}

export interface RentalItem {
  id: string;
  title: string;
  description: string;
  specs?: Spec[];
  pricing: PricingLine[];
  addOns?: PricingLine[];
  images?: string[];
}

export interface RentalPackage {
  title: string;
  includes: string;
  price: number;
}

export const RENTAL_ITEMS: RentalItem[] = [
  {
    id: "adirondack-chair",
    title: "Adirondack Chair",
    description:
      "Classic resin adirondack chairs in three colours — perfect for outdoor events, chair vignettes, or adding extra seating to any setup.",
    specs: [
      { label: "Colors", value: "White, Slate Blue, Gray" },
      { label: "Material", value: "Resin" },
      { label: "Weight Capacity", value: "350 lbs" },
    ],
    pricing: [
      { label: "Per chair", price: 18 },
      { label: "5 or more (each)", price: 15 },
    ],
    images: [
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/Adirondacks%20%281%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/Adirondacks%20%282%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/Adirondacks%20%283%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/Adirondacks%20%284%29.jpg",
    ],
  },
  {
    id: "backdrop-arch",
    title: "Photo Backdrop Arch Frame (Set of 2)",
    description:
      "Two elegant gold arch frames — 7.2 ft and 6 ft — for stunning photo backdrops. Add optional fabric draping for a finished look.",
    specs: [
      { label: "Sizes", value: "7.2 ft and 6 ft" },
      { label: "Frame Color", value: "Gold" },
      { label: "Drapery Colors", value: "Pink, Tan, Navy Blue, Yellow" },
    ],
    pricing: [{ label: "Set of 2", price: 30 }],
    addOns: [{ label: "Fabric Covers", price: 20 }],
    images: [
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/photo%20arch%20%281%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/photo%20arch%20%282%29.jpg",
    ],
  },
  {
    id: "backdrop-square",
    title: "Photo Backdrop Square Frame",
    description:
      "A large 8 × 10 ft gold square backdrop frame with your choice of curtains and a wide range of drape colours.",
    specs: [
      { label: "Size", value: "8 ft × 10 ft" },
      { label: "Weight", value: "12 lbs" },
      { label: "Frame Color", value: "Gold" },
      { label: "Drape Colors", value: "Yellow, Pink, Lavender, Black, Sheer, Red Gingham, Pink Ribbon Wall" },
    ],
    pricing: [{ label: "Frame", price: 30 }],
    addOns: [{ label: "2-Panel Curtains", price: 20 }],
    images: [
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/photo%20backdrop%20%281%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/photo%20backdrop%20%282%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/photo%20backdrop%20%283%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/photo%20backdrop%20%284%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/photo%20backdrop%20%285%29.jpg",
    ],
  },
  {
    id: "table-overhang",
    title: "Table Overhang for Décor",
    description:
      "An adjustable gold rod with clamps that arches over your table — perfect for adding balloons, fairy lights, banners, and garland to any celebration.",
    specs: [],
    pricing: [{ label: "Rod, Clamps & Hardware", price: 20 }],
    addOns: [
      { label: "2-Panel Drapes", price: 20 },
      { label: "Fairy Lights", price: 10 },
      { label: "Bistro Lights", price: 15 },
      { label: "Greenery Garland", price: 10 },
    ],
  },
  {
    id: "neon-signs",
    title: "Neon Signs",
    description:
      "Eye-catching LED neon signs for birthdays, celebrations, and special occasions. Choose the message that fits your event.",
    specs: [],
    pricing: [
      { label: '"Happy Birthday"', price: 40 },
      { label: '"Sweet 16"', price: 25 },
      { label: '"I Love You More"', price: 40 },
      { label: '"You\'re Like Really Pretty"', price: 25 },
      { label: '"Let\'s Party"', price: 50 },
      { label: "Assortment of Neon Hearts", price: 20 },
    ],
    images: [
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/neon%20sign%20%281%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/neon%20sign%20%282%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/neon%20sign%20%283%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/neon%20sign%20%284%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/neon%20sign%20%285%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/neon%20sign%20%286%29.jpg",
      "https://zpzbfhpows2azjpq.public.blob.vercel-storage.com/neon%20sign%20%287%29.jpg",
    ],
  },
  {
    id: "marquee-letters",
    title: "4 ft Marquee Letters",
    description:
      "Bold 4-foot marquee letters made from cardboard with plastic bulbs. Make a statement at any birthday, shower, or wedding.",
    specs: [{ label: "Material", value: "Cardboard with Plastic Bulbs" }],
    pricing: [
      { label: "Per letter", price: 50 },
      { label: "3 or more (each)", price: 35 },
      { label: '"Mr & Mrs" set', price: 150 },
    ],
  },
];

export const PACKAGES: RentalPackage[] = [
  {
    title: "Photo Backdrop Bundle",
    includes: "Square Photo Backdrop · 2-Panel Curtains · One Marquee Letter",
    price: 100,
  },
  {
    title: "Decorated Table Setup",
    includes: "Table Overhang · Fairy Lights · Greenery Garland",
    price: 30,
  },
  {
    title: "Birthday Party Bundle",
    includes: 'Table Overhang · 2-Panel Curtains · "Happy Birthday" Neon Sign',
    price: 70,
  },
  {
    title: "Romantic Arch Package",
    includes: '2 Arch Backdrops · 2 Fabric Covers · "I Love You More" or "Happy Birthday" Neon Sign',
    price: 80,
  },
];
