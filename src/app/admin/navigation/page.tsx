import { createClient } from "@/lib/supabase/server";
import NavigationManager from "./navigation-manager";

export default async function NavigationPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("navigation_items")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Navigation</h1>
        <p className="text-warm-gray mt-1">Manage your site navigation menu. Drag to reorder, indent items to create sub-menus.</p>
      </div>
      <NavigationManager initialItems={items ?? []} />
    </div>
  );
}
