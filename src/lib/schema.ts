// Schema.org structured data helpers for SEO

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://picnicpotential.com";

/**
 * Base organization schema for Picnic Potential
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EventPlanner",
    "@id": `${SITE_URL}/#organization`,
    "name": "Picnic Potential",
    "description": "Luxury picnic and event planning services in Sonoma County wine country",
    "url": SITE_URL,
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "38.5",
        "longitude": "-122.8"
      },
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "CA",
        "addressLocality": "Sonoma County"
      }
    },
    "priceRange": "$$-$$$"
  };
}

/**
 * Service schema for individual service pages
 */
export function generateServiceSchema(service: {
  title: string;
  description?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "serviceType": service.title,
    "description": service.description || `${service.title} services by Picnic Potential`,
    "provider": {
      "@id": `${SITE_URL}/#organization`
    },
    "areaServed": {
      "@type": "Place",
      "name": "Sonoma County, CA"
    },
    "url": `${SITE_URL}/services/${service.slug}`
  };
}

/**
 * ItemList schema for listing pages (services, partners, seating)
 */
export function generateItemListSchema(
  items: Array<{ title?: string; name?: string; slug: string }>,
  listType: "services" | "partners" | "seating"
) {
  const baseUrl = `${SITE_URL}/${listType}`;

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": listType === "services" ? "Service" : "Thing",
        "name": item.title || item.name,
        "url": `${baseUrl}/${item.slug}`
      }
    }))
  };
}

/**
 * Review aggregation schema for testimonials
 */
export function generateReviewsSchema(testimonials: Array<{
  author: string;
  text: string;
  id: string;
}>) {
  const reviews = testimonials.map((testimonial) => ({
    "@type": "Review",
    "author": {
      "@type": "Person",
      "name": testimonial.author
    },
    "reviewBody": testimonial.text,
    "itemReviewed": {
      "@id": `${SITE_URL}/#organization`
    }
  }));

  // Aggregate rating based on number of testimonials (all positive)
  const aggregateRating = testimonials.length > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": testimonials.length.toString(),
    "bestRating": "5",
    "worstRating": "5"
  } : null;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "review": reviews,
    ...(aggregateRating && { "aggregateRating": aggregateRating })
  };
}

/**
 * FAQPage schema for FAQ pages
 */
export function generateFAQSchema(faqs: Array<{
  question: string;
  answer: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Breadcrumb schema for detail pages
 */
export function generateBreadcrumbSchema(items: Array<{
  name: string;
  url?: string;
}>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.url && { "item": `${SITE_URL}${item.url}` })
    }))
  };
}

/**
 * Determine schema type based on partner category
 */
function getPartnerSchemaType(category: string, partnerType: string): string {
  const lowerCategory = category.toLowerCase();

  // VIP Partners - food/service related
  if (lowerCategory.includes("charcuterie") || lowerCategory.includes("grazing")) {
    return "FoodEstablishment";
  }
  if (lowerCategory.includes("dessert") || lowerCategory.includes("bakery") || lowerCategory.includes("cake")) {
    return "Bakery";
  }
  if (lowerCategory.includes("flower") || lowerCategory.includes("floral")) {
    return "Florist";
  }

  // Winery Partners
  if (partnerType === "Winery" || lowerCategory.includes("winery")) {
    return "Winery";
  }

  // Preferred Partners
  if (lowerCategory.includes("photograph") || lowerCategory.includes("photo")) {
    return "ProfessionalService";
  }
  if (lowerCategory.includes("balloon")) {
    return "LocalBusiness";
  }

  // Default
  return "LocalBusiness";
}

/**
 * Organization schema for partner pages
 */
export function generatePartnerSchema(partner: {
  name: string;
  category: string;
  partner_type: string;
  description?: string;
  location?: string;
  website?: string;
  instagram?: string;
  logo?: string;
  slug: string;
}) {
  const schemaType = getPartnerSchemaType(partner.category, partner.partner_type);

  // Parse location for address
  const addressParts = partner.location?.split(",") || [];
  const addressLocality = addressParts[0]?.trim();
  const addressRegion = addressParts[addressParts.length - 1]?.trim() || "CA";

  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": schemaType,
    "name": partner.name,
    "description": partner.description
  };

  if (partner.location) {
    schema.address = {
      "@type": "PostalAddress",
      "addressLocality": addressLocality,
      "addressRegion": addressRegion
    };
  }

  if (partner.website) {
    schema.url = partner.website;
  }

  if (partner.logo) {
    schema.image = partner.logo;
  }

  const sameAs = [];
  if (partner.website) sameAs.push(partner.website);
  if (partner.instagram) sameAs.push(partner.instagram);
  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  return schema;
}

/**
 * Product schema for seating/rental items
 */
export function generateProductSchema(item: {
  title: string;
  description?: string;
  slug: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": item.title,
    "description": item.description || `${item.title} rental by Picnic Potential`,
    "url": `${SITE_URL}/seating/${item.slug}`,
    ...(item.image && { "image": item.image }),
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock",
      "priceCurrency": "USD"
    }
  };
}
