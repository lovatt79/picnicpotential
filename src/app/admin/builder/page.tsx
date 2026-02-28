import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { BuilderContainer } from "@/lib/builder-types";

export default async function BuilderListPage() {
  const supabase = await createClient();

  const { data: pages } = await supabase
    .from("builder_pages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Page Builder</h1>
          <p className="text-warm-gray mt-1">Create and manage custom landing pages</p>
        </div>
        <Link
          href="/admin/builder/new"
          className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Page
        </Link>
      </div>

      <div className="grid gap-4">
        {(pages ?? []).map((page) => {
          const containers = (page.content as BuilderContainer[]) || [];
          const elementCount = containers.reduce(
            (total, c) => {
              // Support both new (rows) and legacy (columns) format
              if (c.rows && c.rows.length > 0) {
                return total + c.rows.reduce((rt, row) =>
                  rt + row.columns.reduce((ct, col) => ct + col.elements.length, 0), 0);
              }
              return total + (c.columns || []).reduce((ct, col) => ct + col.elements.length, 0);
            },
            0
          );

          return (
            <Link
              key={page.id}
              href={`/admin/builder/${page.id}`}
              className="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-serif text-xl text-charcoal">{page.title}</h2>
                    <p className="text-sm text-warm-gray mt-0.5">
                      /{page.slug} &middot; {containers.length} container{containers.length !== 1 ? "s" : ""}, {elementCount} element{elementCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {page.is_published ? (
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
              {page.meta_description && (
                <p className="text-sm text-warm-gray mt-3 line-clamp-2">{page.meta_description}</p>
              )}
            </Link>
          );
        })}

        {(!pages || pages.length === 0) && (
          <div className="text-center py-12 text-warm-gray">
            No pages yet. Click &quot;Add Page&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}
