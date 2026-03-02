"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Blush Pink" },
];

export default function ColorsPage() {
  return (
    <SortableOptionsTable
      tableName="form_color_options"
      title="Color Options"
      subtitle="Manage color palette options for picnic setups"
      columns={columns}
      addButtonLabel="+ Add New Color Option"
      addFormTitle="New Color Option"
      deleteConfirmMessage="Delete this color option?"
    />
  );
}
