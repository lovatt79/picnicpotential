import Link from "next/link";

interface VendorCardProps {
  name: string;
  category: string;
  location?: string;
  url?: string;
  logo?: string;
  href?: string; // Internal link (e.g., /partners/slug)
  isDogFriendly?: boolean;
  isFamilyFriendly?: boolean;
  allowsOutsideFood?: boolean;
  allowsPpFoodOnly?: boolean;
}

export default function VendorCard({ name, category, location, url, logo, href, isDogFriendly, isFamilyFriendly, allowsOutsideFood, allowsPpFoodOnly }: VendorCardProps) {
  const hasBadges = isDogFriendly || isFamilyFriendly || allowsOutsideFood || allowsPpFoodOnly;

  const content = (
    <>
      {logo ? (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-sage-light transition-colors group-hover:border-sage overflow-hidden">
          <img src={logo} alt={name} className="max-h-16 max-w-16 object-contain" />
        </div>
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-light transition-colors group-hover:bg-sage">
          <span className="font-serif text-2xl text-sage-dark">{name.charAt(0)}</span>
        </div>
      )}
      <h4 className="mt-4 text-center font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
        {name}
      </h4>
      <p className="mt-1 text-sm text-gold">{category}</p>
      {location && (
        <p className="mt-1 text-xs text-warm-gray">{location}</p>
      )}
      {hasBadges && (
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {isDogFriendly && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-medium">Dog Friendly</span>}
          {isFamilyFriendly && <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">Family Friendly</span>}
          {allowsOutsideFood && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium">Outside Food OK</span>}
          {allowsPpFoodOnly && <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-medium">PP Food Only</span>}
        </div>
      )}
    </>
  );

  // If href is provided, use internal Link
  if (href) {
    return (
      <Link
        href={href}
        className="group flex h-full flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
      >
        {content}
      </Link>
    );
  }

  // If url is provided, use external link
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex h-full flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
      >
        {content}
      </a>
    );
  }

  // Otherwise, just a card without link
  return (
    <div className="group flex h-full flex-col items-center rounded-2xl bg-white p-6 shadow-sm">
      {content}
    </div>
  );
}
