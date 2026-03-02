"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Arch Decor" },
  { key: "description", header: "Description", type: "text", placeholder: "Add-on description" },
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
      { value: "per_hour", label: "Per Hour" },
    ],
  },
  {
    key: "category",
    header: "Category",
    type: "select",
    width: "w-36",
    defaultValue: "essentials",
    options: [
      { value: "essentials", label: "Essentials" },
      { value: "decor", label: "Decor" },
      { value: "neon_signs", label: "Neon Signs" },
      { value: "flowers", label: "Flowers" },
      { value: "equipment", label: "Equipment" },
    ],
  },
];

export default function WsAddonsPage() {
  return (
    <SortableOptionsTable
      tableName="ws_addon_options"
      title="Wedding Suite Add-ons"
      subtitle="Manage add-on options for the wedding suite form"
      columns={columns}
      addButtonLabel="+ Add New Add-on"
      addFormTitle="New Add-on Option"
      deleteConfirmMessage="Delete this add-on?"
    />
  );
}
