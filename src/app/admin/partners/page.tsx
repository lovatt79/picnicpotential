import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PartnersList } from "./partners-list";

export default async function PartnersPage() {
  const supabase = await createClient();

  const [{ data: partners }, { data: sections }] = await Promise.all([
    supabase.from("vendor_partners").select("*").order("sort_order"),
    supabase.from("partner_sections").select("*").order("sort_order"),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Vendor Partners</h1>
          <p className="text-warm-gray mt-1">Manage partners and sections</p>
        </div>
        <Link
          href="/admin/partners/new"
          className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Partner
        </Link>
      </div>

      <PartnersList
        initialPartners={partners || []}
        initialSections={sections || []}
      />
    </div>
  );
}
