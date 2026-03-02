"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";

export default function DessertsPage() {
  return (
    <SortableOptionsTable
      tableName="form_dessert_options"
      title="Dessert Options"
      subtitle="Manage dessert options in the service request form"
      addButtonLabel="+ Add New Dessert Option"
      addFormTitle="New Dessert Option"
      deleteConfirmMessage="Delete this dessert option?"
      columns={[
        {
          key: "label",
          header: "Label",
          type: "text",
          required: true,
          placeholder: "e.g., Chocolate Chip Cookies",
        },
        {
          key: "price",
          header: "Price",
          type: "number",
          step: "0.01",
          nullable: true,
          placeholder: "15.00",
          width: "w-24",
        },
        {
          key: "price_unit",
          header: "Unit",
          type: "select",
          defaultValue: "per_dozen",
          width: "w-28",
          options: [
            { value: "per_dozen", label: "Per Dozen" },
            { value: "per_person", label: "Per Person" },
            { value: "flat", label: "Flat Fee" },
          ],
        },
        {
          key: "min_quantity",
          header: "Min Qty",
          type: "number",
          nullable: true,
          placeholder: "1",
          width: "w-20",
        },
        {
          key: "is_vegan",
          header: "Vegan",
          type: "toggle",
          toggleColor: "bg-green-500",
          defaultValue: false,
        },
        {
          key: "is_gluten_free",
          header: "GF",
          type: "toggle",
          toggleColor: "bg-amber-500",
          defaultValue: false,
        },
      ]}
    />
  );
}
