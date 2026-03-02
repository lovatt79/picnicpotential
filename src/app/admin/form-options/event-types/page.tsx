"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Picnic" },
  { key: "value", header: "Value", type: "text", width: "w-40", placeholder: "e.g., picnic" },
];

export default function EventTypesPage() {
  return (
    <SortableOptionsTable
      tableName="form_event_types"
      title="Event Types"
      subtitle="Manage event type options for forms"
      columns={columns}
      addButtonLabel="+ Add New Event Type"
      addFormTitle="New Event Type"
      deleteConfirmMessage="Delete this event type?"
    />
  );
}
