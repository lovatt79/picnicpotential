import Link from "next/link";

interface SeatingCardProps {
  title: string;
  description: string;
  image?: string;
  href?: string;
}

const PASTEL_GRADIENTS = [
  "from-peach-light to-blush",
  "from-sky-light to-lavender-light",
  "from-sage-light to-peach-light",
  "from-blush-light to-sky-light",
  "from-lavender to-blush-light",
  "from-peach to-sage-light",
];

export default function SeatingCard({ title, description, image, href }: SeatingCardProps) {
  const gradientIndex = title.length % PASTEL_GRADIENTS.length;
  const gradient = PASTEL_GRADIENTS[gradientIndex];

  const content = (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden">
        {image ? (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
            <span className="font-serif text-lg text-charcoal/50">{title}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl text-charcoal">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-warm-gray">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
