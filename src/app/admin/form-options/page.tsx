import Link from "next/link";

const serviceOptions = [
  { href: "/admin/form-options/event-types", label: "Event Types", description: "Picnic, Tablescapes, Event Decor, Rentals" },
  { href: "/admin/form-options/colors", label: "Color Options", description: "Color palettes for picnic setups" },
  { href: "/admin/form-options/food", label: "Food Options", description: "Charcuterie, sandwiches, platters with pricing" },
  { href: "/admin/form-options/desserts", label: "Dessert Options", description: "Cookies, cakes, vegan options with pricing" },
  { href: "/admin/form-options/addons", label: "Add-ons", description: "Chairs, games, tents, flowers with pricing" },
  { href: "/admin/form-options/time-addons", label: "Additional Time", description: "Extra hours with pricing (1hr/$50, 2hrs/$100, etc.)" },
  { href: "/admin/form-options/locations", label: "Locations/Venues", description: "Wineries, parks, venues with notes" },
  { href: "/admin/form-options/occasions", label: "Occasion Types", description: "Birthday, wedding, corporate, etc." },
  { href: "/admin/form-options/attribution", label: "How Did You Hear", description: "Referral sources and attribution" },
];

const weddingSuiteOptions = [
  { href: "/admin/form-options/wedding-suite/packages", label: "Packages", description: "Suite packages with pricing tiers" },
  { href: "/admin/form-options/wedding-suite/food", label: "Food & Drinks", description: "Charcuterie, mimosa bar, desserts" },
  { href: "/admin/form-options/wedding-suite/addons", label: "Add-ons", description: "Essentials, decor, neon signs, flowers, equipment" },
  { href: "/admin/form-options/wedding-suite/gifts", label: "Wedding Party Gifts", description: "Personalized gifts for the wedding party" },
];

const proposalOptions = [
  { href: "/admin/form-options/proposal/packages", label: "Packages", description: "Intimate, Signature, Luxe proposal tiers" },
  { href: "/admin/form-options/proposal/addons", label: "Add-ons", description: "Umbrella, cabana, neon sign, hurricane vases, etc." },
  { href: "/admin/form-options/proposal/food", label: "Food & Flowers", description: "Sandwich box, charcuterie, strawberries, flowers" },
];

export default function FormOptionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Form Options</h1>
        <p className="text-warm-gray mt-1">Manage dropdown options in the request forms</p>
      </div>

      <h2 className="font-serif text-xl text-charcoal mb-4">Service Request Form</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {serviceOptions.map((type) => (
          <Link
            key={type.href}
            href={type.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <h3 className="font-medium text-charcoal group-hover:text-gold transition-colors">{type.label}</h3>
            <p className="text-sm text-warm-gray mt-1">{type.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-serif text-xl text-charcoal mb-4">Wedding Suite Form</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {weddingSuiteOptions.map((type) => (
          <Link
            key={type.href}
            href={type.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <h3 className="font-medium text-charcoal group-hover:text-gold transition-colors">{type.label}</h3>
            <p className="text-sm text-warm-gray mt-1">{type.description}</p>
          </Link>
        ))}
      </div>

      <h2 className="font-serif text-xl text-charcoal mb-4">Proposal Form</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {proposalOptions.map((type) => (
          <Link
            key={type.href}
            href={type.href}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
          >
            <h3 className="font-medium text-charcoal group-hover:text-gold transition-colors">{type.label}</h3>
            <p className="text-sm text-warm-gray mt-1">{type.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
