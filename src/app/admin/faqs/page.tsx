import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function FAQsPage() {
  const supabase = await createClient();
  const { data: faqs } = await supabase.from("faqs").select("*").order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">FAQs</h1>
          <p className="text-warm-gray mt-1">Manage frequently asked questions</p>
        </div>
        <Link href="/admin/faqs/new" className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add FAQ
        </Link>
      </div>

      {faqs && faqs.length > 0 ? (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-charcoal">{faq.question}</h3>
                  <p className="text-sm text-warm-gray mt-1 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${faq.is_published ? "bg-sage text-charcoal" : "bg-gray-200 text-gray-600"}`}>
                    {faq.is_published ? "Published" : "Draft"}
                  </span>
                  <Link href={`/admin/faqs/${faq.id}`} className="text-gold hover:text-charcoal text-sm">Edit</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="font-serif text-xl text-charcoal mb-2">No FAQs yet</h3>
          <p className="text-warm-gray mb-6">Add frequently asked questions to help your customers</p>
          <Link href="/admin/faqs/new" className="inline-flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors">Add FAQ</Link>
        </div>
      )}
    </div>
  );
}
