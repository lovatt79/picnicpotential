"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WineryPartner } from "@/lib/supabase/types";

export default function WineriesPage() {
  const supabase = createClient();
  const [wineries, setWineries] = useState<WineryPartner[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWineries();
  }, []);

  async function loadWineries() {
    const { data } = await supabase.from("winery_partners").select("*").order("sort_order");
    setWineries(data ?? []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    await supabase.from("winery_partners").insert({ name: newName.trim() });
    setNewName("");
    loadWineries();
  }

  async function handleUpdate(id: string) {
    if (!editName.trim()) return;
    await supabase.from("winery_partners").update({ name: editName.trim() }).eq("id", id);
    setEditingId(null);
    loadWineries();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this winery?")) return;
    await supabase.from("winery_partners").delete().eq("id", id);
    loadWineries();
  }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">Winery Partners</h1>
        <p className="text-warm-gray mt-1">Manage your winery partner list</p>
      </div>

      <div className="max-w-xl">
        <form onSubmit={handleAdd} className="flex gap-3 mb-6">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Add new winery..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button type="submit" className="bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors">Add</button>
        </form>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {wineries.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {wineries.map((winery) => (
                <li key={winery.id} className="p-4 flex items-center justify-between">
                  {editingId === winery.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                        autoFocus
                      />
                      <button onClick={() => handleUpdate(winery.id)} className="text-gold text-sm">Save</button>
                      <button onClick={() => setEditingId(null)} className="text-warm-gray text-sm">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <span className="text-charcoal">{winery.name}</span>
                      <div className="flex gap-3">
                        <button onClick={() => { setEditingId(winery.id); setEditName(winery.name); }} className="text-gold text-sm">Edit</button>
                        <button onClick={() => handleDelete(winery.id)} className="text-red-600 text-sm">Delete</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-8 text-center text-warm-gray">No wineries added yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
