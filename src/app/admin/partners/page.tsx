import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data: partners } = await supabase.from("vendor_partners").select("*").order("sort_order");

  const vipPartners = partners?.filter(p => p.partner_type === "VIP") ?? [];
  const preferredPartners = partners?.filter(p => p.partner_type === "Preferred") ?? [];
  const wineryPartners = partners?.filter(p => p.partner_type === "Winery") ?? [];

  const PartnerCard = ({ partner }: { partner: typeof partners extends (infer T)[] | null ? T : never }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-charcoal">{partner.name}</h3>
          <span className={`px-2 py-0.5 text-xs rounded-full ${partner.is_published ? "bg-sage text-charcoal" : "bg-gray-200 text-gray-600"}`}>
            {partner.is_published ? "Published" : "Draft"}
          </span>
        </div>
        <p className="text-sm text-warm-gray">{partner.category} &bull; {partner.location}</p>
      </div>
      <Link href={`/admin/partners/${partner.id}`} className="text-gold hover:text-charcoal text-sm">Edit</Link>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Vendor Partners</h1>
          <p className="text-warm-gray mt-1">Manage VIP and Preferred partners</p>
        </div>
        <Link href="/admin/partners/new" className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Partner
        </Link>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-xl text-charcoal mb-4">VIP Partners ({vipPartners.length})</h2>
          {vipPartners.length > 0 ? (
            <div className="space-y-3">{vipPartners.map(p => <PartnerCard key={p.id} partner={p} />)}</div>
          ) : (
            <p className="text-warm-gray">No VIP partners yet</p>
          )}
        </div>

        <div>
          <h2 className="font-serif text-xl text-charcoal mb-4">Preferred Partners ({preferredPartners.length})</h2>
          {preferredPartners.length > 0 ? (
            <div className="space-y-3">{preferredPartners.map(p => <PartnerCard key={p.id} partner={p} />)}</div>
          ) : (
            <p className="text-warm-gray">No Preferred partners yet</p>
          )}
        </div>

        <div>
          <h2 className="font-serif text-xl text-charcoal mb-4">Winery Partners ({wineryPartners.length})</h2>
          {wineryPartners.length > 0 ? (
            <div className="space-y-3">{wineryPartners.map(p => <PartnerCard key={p.id} partner={p} />)}</div>
          ) : (
            <p className="text-warm-gray">No Winery partners yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
