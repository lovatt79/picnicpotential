"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Charcuterie Board" },
  { key: "description", header: "Description", type: "text", placeholder: "Food/drink description" },
  { key: "price", header: "Price", type: "number", width: "w-28", step: "0.01", nullable: true, placeholder: "$" },
  {
    key: "price_unit",
    header: "Unit",
    type: "select",
    width: "w-32",
    defaultValue: "flat",
    options: [
      { value: "flat", label: "Flat Fee" },
      { value: "per_person", label: "Per Person" },
      { value: "per_dozen", label: "Per Dozen" },
    ],
  },
  {
    key: "category",
    header: "Category",
    type: "select",
    width: "w-32",
    defaultValue: "charcuterie",
    options: [
      { value: "charcuterie", label: "Charcuterie" },
      { value: "drinks", label: "Drinks" },
      { value: "desserts", label: "Desserts" },
    ],
  },
];

export default function WsFoodPage() {
  return (
    <SortableOptionsTable
      tableName="ws_food_options"
      title="Wedding Suite Food & Drinks"
      subtitle="Manage food and drink options for the wedding suite form"
      columns={columns}
      addButtonLabel="+ Add New Option"
      addFormTitle="New Food/Drink Option"
      deleteConfirmMessage="Delete this food option?"
    />
  );
}
