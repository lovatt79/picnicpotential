"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., +1 Hour" },
  { key: "hours", header: "Hours", type: "number", width: "w-24", defaultValue: 1 },
  { key: "price", header: "Price", type: "number", width: "w-28", step: "0.01", nullable: true, placeholder: "$" },
];

export default function TimeAddonsPage() {
  return (
    <SortableOptionsTable
      tableName="form_time_addon_options"
      title="Time Add-ons"
      subtitle="Manage additional time options and pricing"
      columns={columns}
      addButtonLabel="+ Add New Time Add-on"
      addFormTitle="New Time Add-on"
      deleteConfirmMessage="Delete this time add-on?"
    />
  );
}
