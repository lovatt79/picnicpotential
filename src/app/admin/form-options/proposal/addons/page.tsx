"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Rose Petals" },
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
];

export default function PropAddonsPage() {
  return (
    <SortableOptionsTable
      tableName="prop_addon_options"
      title="Proposal Add-ons"
      subtitle="Manage add-on options for proposal forms"
      columns={columns}
      addButtonLabel="+ Add New Add-on"
      addFormTitle="New Add-on"
      deleteConfirmMessage="Delete this add-on?"
    />
  );
}
