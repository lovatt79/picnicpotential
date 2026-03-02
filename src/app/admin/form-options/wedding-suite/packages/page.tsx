"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Classic Suite" },
  { key: "description", header: "Description", type: "text", placeholder: "Package description" },
  { key: "price", header: "Price", type: "number", width: "w-28", step: "0.01", nullable: true, placeholder: "$" },
];

export default function WsPackagesPage() {
  return (
    <SortableOptionsTable
      tableName="ws_package_options"
      title="Wedding Suite Packages"
      subtitle="Manage suite packages and pricing"
      columns={columns}
      addButtonLabel="+ Add New Package"
      addFormTitle="New Package"
      deleteConfirmMessage="Delete this package?"
    />
  );
}
