import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { generateOrganizationSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Picnic Potential and our passion for creating unique picnic and event experiences in Sonoma County.",
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

function getIconEmoji(icon: string): string {
  const iconMap: Record<string, string> = {
    check: "✓",
    star: "⭐",
    sparkles: "✨",
    heart: "❤️",
    truck: "🚚",
    camera: "📷",
    cake: "🎂",
    gift: "🎁",
    music: "🎵",
    palette: "🎨",
    strawberry: "🍓",
    flowers: "💐",
    champagne: "🥂",
    cheese: "🧀",
    cupcake: "🧁",
    vase: "🏺",
    games: "🎲",
    drinks: "🍹",
    soda: "🥤",
    juicebox: "🧃",
    frisbee: "🥏",
    cornhole: "🎯",
    connect4: "🔴",
    outdoors: "🌳",
    events: "🎉",
    scenery: "🏞️",
    target: "🎯",
    chairs: "🪑",
    tables: "🍽️",
    wine: "🍷",
    beer: "🍺",
    winery: "🍇",
    garden: "🌿",
    beach: "🏖️",
    linen: "🧵",
    tablecloth: "🫗",
    lights: "💡",
    dinnerparty: "🕯️",
    namecard: "📋",
    balloons: "🎈",
  };
  return iconMap[icon] || "✓";
}

export default async function AboutPage() {
  const supabase = await createClient();
  const organizationSchema = generateOrganizationSchema();

  // Fetch page hero
  const { data: hero } = await supabase
    .from("page_heroes")
    .select("*")
    .eq("page_key", "about")
    .single();

  // Fetch about content
  const { data: aboutContent } = await supabase
    .from("about_content")
    .select("*")
    .single();

  // Fetch about features
  const { data: aboutFeatures } = await supabase
    .from("about_features")
    .select("*")
    .order("sort_order", { ascending: true });

  // Fallback values
  const heroTitle = hero?.title || "About Us";
  const heroDescription = hero?.description || "Creating memorable experiences in Sonoma County wine country.";
  const heroImageUrl = hero?.image_url;

  // Determine story image URL: DB image > fallback hardcoded
  let storyImageUrl = aboutContent?.our_story_image_url || null;
  if (!storyImageUrl && aboutContent?.our_story_image_id) {
    const { data: storyImgData } = await supabase
      .from("media")
      .select("url")
      .eq("id", aboutContent.our_story_image_id)
      .single();
    storyImageUrl = storyImgData?.url || null;
  }
  if (!storyImageUrl) {
    storyImageUrl = "https://lh3.googleusercontent.com/pw/AP1GczOi8OMC9Vzzvkg1c5KE0kRM1qAlaPpVbIBkqjxNrlL12iafz3PS7TrU2MNWC6tSVR8dwv7u9PeX1VdksHvmwiWzjmfioh6cgpPdq_bWV76Rz5zvpRXT6iXKe9xqdnHP4qA71kEqRQLj85_EA-QaUC8Jbg=w1024-h771-s-no-gm?authuser=0";
  }

  const storyTitle = aboutContent?.our_story_title || "Our Story";
  const storyText = aboutContent?.our_story_text || "Picnic Potential was born from a love of bringing people together in beautiful settings. Based in Sonoma County, we specialize in creating unforgettable outdoor experiences that combine the natural beauty of wine country with thoughtful, elegant design.\n\nWhether it's an intimate date night, a milestone birthday, a corporate retreat, or a dreamy proposal, we pour attention and care into every detail. From the ground cover to the centerpieces, every element is curated to create the atmosphere you envision.\n\nWe believe that life's special moments deserve special settings. That's why we handle everything from setup to cleanup, so you can be fully present and enjoy every minute.";
  const featuresTitle = aboutContent?.features_title || "What Sets Us Apart";
  const serviceAreaTitle = aboutContent?.service_area_title || "Service Area";
  const serviceAreaText = aboutContent?.service_area_text || "We primarily serve Sonoma County and the surrounding wine country areas, including Petaluma, Santa Rosa, Healdsburg, Windsor, Sebastopol, and beyond. For events outside our standard service area, please reach out — we are happy to discuss options.";

  const features = aboutFeatures && aboutFeatures.length > 0
    ? aboutFeatures
    : [
        { id: "1", title: "Attention to Detail", description: "Every element is thoughtfully curated, from personalized place cards to statement centerpieces.", icon: "heart" },
        { id: "2", title: "Full Service", description: "We handle everything from design and setup to vendor coordination and cleanup.", icon: "sparkles" },
        { id: "3", title: "Local Expertise", description: "Deep roots in Sonoma County with trusted vendor partnerships and venue knowledge.", icon: "star" },
      ];

  // Split story text into paragraphs
  const storyParagraphs = storyText.split("\n\n").filter(Boolean);

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero */}
      {heroImageUrl ? (
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImageUrl}
              alt="About Picnic Potential"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-charcoal/50" />
          </div>
          <div className="relative mx-auto max-w-4xl px-4 py-24 text-center">
            <h1 className="font-serif text-4xl text-white md:text-5xl">{heroTitle}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
              {heroDescription}
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-sage py-20">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <h1 className="font-serif text-4xl text-charcoal md:text-5xl">{heroTitle}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal/70">
              {heroDescription}
            </p>
          </div>
        </section>
      )}

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Image placeholder */}
            <div className="aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={storyImageUrl}
                alt="Alison, founder of Picnic Potential"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{storyTitle}</h2>
              {storyParagraphs.map((paragraph: string, index: number) => (
                <p key={index} className={`${index === 0 ? "mt-6" : "mt-4"} text-lg leading-relaxed text-warm-gray`}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-serif text-3xl text-charcoal md:text-4xl">
            {featuresTitle}
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((item) => (
              <div key={item.id} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage text-2xl">
                  {getIconEmoji(item.icon)}
                </div>
                <h3 className="mt-6 font-serif text-xl text-charcoal">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-warm-gray">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal md:text-4xl">{serviceAreaTitle}</h2>
          <p className="mt-6 text-lg leading-relaxed text-warm-gray">
            {serviceAreaText}
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-sage py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-3xl text-charcoal">
            Let&apos;s Create Something Beautiful Together
          </h2>
          <p className="mt-4 text-charcoal/70">
            We would love to hear about your upcoming event or celebration.
          </p>
          <Link
            href="/request"
            className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-lg font-medium text-charcoal transition-colors hover:bg-gold-light"
          >
            Book Your Experience
          </Link>
        </div>
      </section>
    </>
  );
}
