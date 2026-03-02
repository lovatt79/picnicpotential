"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Instagram" },
];

export default function AttributionPage() {
  return (
    <SortableOptionsTable
      tableName="form_attribution_options"
      title="Attribution Sources"
      subtitle="Manage how clients found us (referral sources)"
      columns={columns}
      addButtonLabel="+ Add New Attribution Source"
      addFormTitle="New Attribution Source"
      deleteConfirmMessage="Delete this attribution source?"
    />
  );
}
