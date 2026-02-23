import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { SeatingList } from "./seating-list";
import HeroEditor from "@/components/admin/HeroEditor";

export default async function SeatingPage() {
  const supabase = await createClient();

  const [{ data: seatingOptions }, { data: sections }] = await Promise.all([
    supabase.from("seating_options").select("*").order("sort_order"),
    supabase.from("seating_sections").select("*").order("sort_order"),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Seating Options</h1>
          <p className="text-warm-gray mt-1">Manage your seating styles</p>
        </div>
        <Link
          href="/admin/seating/new"
          className="flex items-center gap-2 bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Seating Option
        </Link>
      </div>

      <HeroEditor pageKey="seating" label="Seating Styles Page Hero" />

      <div className="mt-8">
        <SeatingList
          initialItems={seatingOptions ?? []}
          initialSections={sections ?? []}
        />
      </div>
    </div>
  );
}
