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
  { key: "is_dog_friendly", header: "Dogs", type: "toggle", width: "w-16", toggleColor: "bg-amber-500", defaultValue: false },
  { key: "is_family_friendly", header: "Family", type: "toggle", width: "w-16", toggleColor: "bg-blue-500", defaultValue: false },
  { key: "allows_outside_food", header: "Outside Food", type: "toggle", width: "w-16", toggleColor: "bg-green-500", defaultValue: false },
  { key: "allows_pp_food_only", header: "PP Only", type: "toggle", width: "w-16", toggleColor: "bg-purple-500", defaultValue: false },
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
