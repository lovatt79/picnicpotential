import type { Metadata } from "next";
import { generateWebPageSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Send a Hint",
  description: "Want someone special to know about Picnic Potential? Drop a hint and we'll send them a friendly message.",
};

export default function SendAHintLayout({ children }: { children: React.ReactNode }) {
  const schema = generateWebPageSchema({
    title: "Send a Hint",
    description: "Want someone special to know about Picnic Potential? Drop a hint and we'll send them a friendly message.",
    path: "/send-a-hint",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}
