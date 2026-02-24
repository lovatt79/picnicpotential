import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function CollectionsPage() {
  const supabase = await createClient();

  const { data: collections } = await supabase
    .from("collection_pages")
    .select("*, collection_page_items(count)")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Collections</h1>
          <p className="text-warm-gray mt-1">Manage curated groups of services shown as standalone pages</p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Collection
        </Link>
      </div>

      <div className="grid gap-4">
        {(collections ?? []).map((collection) => {
          const itemCount =
            Array.isArray(collection.collection_page_items)
              ? collection.collection_page_items.length
              : (collection.collection_page_items as unknown as { count: number })?.count ?? 0;

          return (
            <Link
              key={collection.id}
              href={`/admin/collections/${collection.id}`}
              className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-sage-light/50 flex items-center justify-center">
                    <svg className="w-5 h-5 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-charcoal">{collection.title}</h2>
                    <p className="text-sm text-warm-gray mt-0.5">
                      /{collection.slug} &middot; {itemCount} service{itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {collection.is_published ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      Draft
                    </span>
                  )}
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {collection.description && (
                <p className="text-sm text-warm-gray mt-3 line-clamp-2">{collection.description}</p>
              )}
            </Link>
          );
        })}

        {(!collections || collections.length === 0) && (
          <div className="text-center py-12 text-warm-gray">
            No collections yet. Click &quot;Add Collection&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}
