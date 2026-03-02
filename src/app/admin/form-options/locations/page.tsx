"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Kendall Jackson" },
  {
    key: "location_type",
    header: "Type",
    type: "select",
    width: "w-32",
    defaultValue: "winery",
    options: [
      { value: "winery", label: "Winery" },
      { value: "park", label: "Park" },
      { value: "home", label: "Home" },
      { value: "venue", label: "Venue" },
      { value: "other", label: "Other" },
    ],
  },
  { key: "city", header: "City", type: "text", width: "w-36", placeholder: "e.g., Santa Rosa" },
  { key: "notes", header: "Notes", type: "text", placeholder: "e.g., Permission required" },
];

export default function LocationsPage() {
  return (
    <SortableOptionsTable
      tableName="form_location_options"
      title="Location Options"
      subtitle="Manage location/venue options for events"
      columns={columns}
      addButtonLabel="+ Add New Location"
      addFormTitle="New Location Option"
      deleteConfirmMessage="Delete this location option?"
    />
  );
}
