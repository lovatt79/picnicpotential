"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Custom Tumblers" },
  { key: "description", header: "Description", type: "text", placeholder: "Gift description" },
  { key: "price", header: "Price (per set of 6)", type: "number", width: "w-28", step: "0.01", nullable: true, placeholder: "$" },
];

export default function WsGiftsPage() {
  return (
    <SortableOptionsTable
      tableName="ws_gift_options"
      title="Wedding Party Gifts"
      subtitle="Manage personalized gift options for the wedding party (priced per set of 6)"
      columns={columns}
      addButtonLabel="+ Add New Gift Option"
      addFormTitle="New Gift Option"
      deleteConfirmMessage="Delete this gift option?"
    />
  );
}
