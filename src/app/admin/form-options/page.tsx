import Link from "next/link";

const optionTypes = [
  { href: "/admin/form-options/event-types", label: "Event Types", description: "Picnic, Tablescapes, Event Decor, Rentals" },
  { href: "/admin/form-options/colors", label: "Color Options", description: "Color palettes for picnic setups" },
  { href: "/admin/form-options/food", label: "Food Options", description: "Charcuterie, sandwiches, platters with pricing" },
  { href: "/admin/form-options/desserts", label: "Dessert Options", description: "Cookies, cakes, vegan options with pricing" },
  { href: "/admin/form-options/addons", label: "Add-ons", description: "Chairs, games, tents, flowers with pricing" },
  { href: "/admin/form-options/occasions", label: "Occasion Types", description: "Birthday, wedding, corporate, etc." },
  { href: "/admin/form-options/attribution", label: "How Did You Hear", description: "Referral sources and attribution" },
];

export default function FormOptionsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Form Options</h1>
        <p className="text-warm-gray mt-1">Manage dropdown options in the service request form</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {optionTypes.map((type) => (
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
