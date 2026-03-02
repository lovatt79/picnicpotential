"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";
import { ColumnDef } from "@/components/admin/form-options/types";

const columns: ColumnDef[] = [
  { key: "label", header: "Label", type: "text", required: true, placeholder: "e.g., Charcuterie Board" },
  { key: "description", header: "Description", type: "text", placeholder: "Food description" },
  { key: "price", header: "Price", type: "number", width: "w-28", step: "0.01", nullable: true, placeholder: "$" },
  {
    key: "price_unit",
    header: "Unit",
    type: "select",
    width: "w-32",
    defaultValue: "flat",
    options: [
      { value: "flat", label: "Flat Fee" },
      { value: "per_person", label: "Per Person" },
      { value: "per_hour", label: "Per Hour" },
    ],
  },
  {
    key: "category",
    header: "Category",
    type: "select",
    width: "w-32",
    defaultValue: "food",
    options: [
      { value: "food", label: "Food" },
      { value: "flowers", label: "Flowers" },
    ],
  },
];

export default function PropFoodPage() {
  return (
    <SortableOptionsTable
      tableName="prop_food_options"
      title="Proposal Food & Flowers"
      subtitle="Manage food and flower options for proposal forms"
      columns={columns}
      addButtonLabel="+ Add New Option"
      addFormTitle="New Food/Flower Option"
      deleteConfirmMessage="Delete this option?"
    />
  );
}
