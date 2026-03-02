"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";

export default function AddonsPage() {
  return (
    <SortableOptionsTable
      tableName="form_addon_options"
      title="Add-on Options"
      subtitle="Manage add-on options in the service request form"
      addButtonLabel="+ Add New Add-on"
      addFormTitle="New Add-on"
      deleteConfirmMessage="Delete this add-on option?"
      columns={[
        {
          key: "label",
          header: "Label",
          type: "text",
          required: true,
          placeholder: "e.g., Lawn Games",
        },
        {
          key: "price",
          header: "Price",
          type: "number",
          step: "0.01",
          nullable: true,
          placeholder: "25.00",
          width: "w-24",
        },
        {
          key: "price_unit",
          header: "Unit",
          type: "select",
          defaultValue: "flat",
          width: "w-28",
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
          defaultValue: "",
          width: "w-32",
          options: [
            { value: "", label: "None" },
            { value: "Lawn Games", label: "Lawn Games" },
            { value: "Furniture", label: "Furniture" },
            { value: "Flowers", label: "Flowers" },
            { value: "Photography", label: "Photography" },
            { value: "Tents", label: "Tents" },
            { value: "Beverages", label: "Beverages" },
            { value: "Other", label: "Other" },
          ],
        },
      ]}
    />
  );
}
