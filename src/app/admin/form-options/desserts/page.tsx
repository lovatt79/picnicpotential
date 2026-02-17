"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface DessertOption {
  id: string;
  label: string;
  price: number | null;
  price_unit: string | null;
  min_quantity: number | null;
  is_vegan: boolean;
  sort_order: number;
  is_active: boolean;
}

export default function DessertsPage() {
  const supabase = createClient();
  const [items, setItems] = useState<DessertOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    label: "",
    price: null as number | null,
    price_unit: "per_dozen",
    min_quantity: null as number | null,
    is_vegan: false,
    sort_order: 0,
    is_active: true
  });
  const [showNewForm, setShowNewForm] = useState(false);
  const [newForm, setNewForm] = useState({
    label: "",
    price: null as number | null,
    price_unit: "per_dozen",
    min_quantity: null as number | null,
    is_vegan: false,
    sort_order: 0,
    is_active: true
  });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const { data } = await supabase
      .from("form_dessert_options")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems(data || []);
    setLoading(false);
  }

  async function handleCreate() {
    await supabase.from("form_dessert_options").insert(newForm);
    setNewForm({
      label: "",
      price: null,
      price_unit: "per_dozen",
      min_quantity: null,
      is_vegan: false,
      sort_order: 0,
      is_active: true
    });
    setShowNewForm(false);
    loadItems();
  }

  async function handleUpdate(id: string) {
    await supabase.from("form_dessert_options").update(editForm).eq("id", id);
    setEditingId(null);
    loadItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this dessert option?")) return;
    await supabase.from("form_dessert_options").delete().eq("id", id);
    loadItems();
  }

  function startEdit(item: DessertOption) {
    setEditingId(item.id);
    setEditForm({
      label: item.label,
      price: item.price,
      price_unit: item.price_unit || "per_dozen",
      min_quantity: item.min_quantity,
      is_vegan: item.is_vegan,
      sort_order: item.sort_order,
      is_active: item.is_active
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/form-options" className="text-sm text-warm-gray hover:text-charcoal flex items-center gap-1 mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Form Options
        </Link>
        <h1 className="font-serif text-3xl text-charcoal">Dessert Options</h1>
        <p className="text-warm-gray mt-1">Manage dessert options in the service request form</p>
      </div>

      {/* Add New Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors"
        >
          {showNewForm ? "Cancel" : "+ Add New Dessert Option"}
        </button>
      </div>

      {/* New Form */}
      {showNewForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-medium text-charcoal mb-4">New Dessert Option</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Label *</label>
              <input
                type="text"
                value={newForm.label}
                onChange={(e) => setNewForm({ ...newForm, label: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="e.g., Chocolate Chip Cookies"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Price</label>
              <input
                type="number"
                step="0.01"
                value={newForm.price ?? ""}
                onChange={(e) => setNewForm({ ...newForm, price: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="15.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Price Unit</label>
              <select
                value={newForm.price_unit}
                onChange={(e) => setNewForm({ ...newForm, price_unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="per_dozen">Per Dozen</option>
                <option value="per_person">Per Person</option>
                <option value="flat">Flat Fee</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Min Quantity</label>
              <input
                type="number"
                value={newForm.min_quantity ?? ""}
                onChange={(e) => setNewForm({ ...newForm, min_quantity: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Sort Order</label>
              <input
                type="number"
                value={newForm.sort_order}
                onChange={(e) => setNewForm({ ...newForm, sort_order: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-6">
            <label className="flex items-center gap-3">
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newForm.is_active}
                  onChange={(e) => setNewForm({ ...newForm, is_active: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
              </div>
              <span className="text-sm text-charcoal">Active</span>
            </label>
            <label className="flex items-center gap-3">
              <div className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newForm.is_vegan}
                  onChange={(e) => setNewForm({ ...newForm, is_vegan: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </div>
              <span className="text-sm text-charcoal">Vegan 🌱</span>
            </label>
          </div>
          <div className="mt-4">
            <button
              onClick={handleCreate}
              disabled={!newForm.label}
              className="bg-charcoal text-white px-6 py-2 rounded-lg hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-sage-light/30 border-b border-sage-light">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider">Min Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider">Vegan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider">Sort</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-charcoal uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-charcoal uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-sage-light/10">
                {editingId === item.id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editForm.label}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        className="w-full px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.price ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value ? parseFloat(e.target.value) : null })}
                        className="w-24 px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={editForm.price_unit}
                        onChange={(e) => setEditForm({ ...editForm, price_unit: e.target.value })}
                        className="px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                      >
                        <option value="per_dozen">Per Dozen</option>
                        <option value="per_person">Per Person</option>
                        <option value="flat">Flat Fee</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editForm.min_quantity ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, min_quantity: e.target.value ? parseInt(e.target.value) : null })}
                        className="w-20 px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.is_vegan}
                          onChange={(e) => setEditForm({ ...editForm, is_vegan: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        value={editForm.sort_order}
                        onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })}
                        className="w-20 px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gold"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editForm.is_active}
                          onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleUpdate(item.id)}
                        className="text-sm text-gold hover:text-gold-dark"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-sm text-warm-gray hover:text-charcoal"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm text-charcoal">
                      {item.label}
                      {item.is_vegan && <span className="ml-2">🌱</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">
                      {item.price ? `$${item.price.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">
                      {item.price_unit ? item.price_unit.replace("_", " ") : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">
                      {item.min_quantity ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      {item.is_vegan ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Vegan
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">{item.sort_order}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {item.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => startEdit(item)}
                        className="text-sm text-gold hover:text-gold-dark"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
