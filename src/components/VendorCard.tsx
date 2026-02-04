interface VendorCardProps {
  name: string;
  category: string;
  location: string;
  url: string;
  logo: string;
}

export default function VendorCard({ name, category, location, url }: VendorCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-lg"
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sage-light transition-colors group-hover:bg-sage">
        <span className="font-serif text-2xl text-sage-dark">{name.charAt(0)}</span>
      </div>
      <h4 className="mt-4 text-center font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
        {name}
      </h4>
      <p className="mt-1 text-sm text-gold">{category}</p>
      {location && (
        <p className="mt-1 text-xs text-warm-gray">{location}</p>
      )}
    </a>
  );
}
