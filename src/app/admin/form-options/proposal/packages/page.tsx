"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Classic Package" },
  { key: "description", header: "Description", type: "text", placeholder: "Package description" },
  { key: "price", header: "Price", type: "number", width: "w-28", step: "0.01", nullable: true, placeholder: "$" },
];

export default function PropPackagesPage() {
  return (
    <SortableOptionsTable
      tableName="prop_package_options"
      title="Proposal Packages"
      subtitle="Manage package options for proposal forms"
      columns={columns}
      addButtonLabel="+ Add New Package"
      addFormTitle="New Package"
      deleteConfirmMessage="Delete this package?"
    />
  );
}
