"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Birthday Party" },
];

export default function OccasionsPage() {
  return (
    <SortableOptionsTable
      tableName="form_occasion_options"
      title="Occasion Options"
      subtitle="Manage occasion options in the service request form"
      columns={columns}
      addButtonLabel="+ Add New Occasion"
      addFormTitle="New Occasion"
      deleteConfirmMessage="Delete this occasion?"
    />
  );
}
