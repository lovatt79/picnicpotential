"use client";

import SortableOptionsTable from "@/components/admin/form-options/SortableOptionsTable";

export default function FoodPage() {
  return (
    <SortableOptionsTable
      tableName="form_food_options"
      title="Food Options"
      subtitle="Manage food options in the service request form"
      addButtonLabel="+ Add New Food Option"
      addFormTitle="New Food Option"
      deleteConfirmMessage="Delete this food option?"
      columns={[
        {
          key: "label",
          header: "Label",
          type: "text",
          required: true,
          placeholder: "e.g., Charcuterie Board",
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
          defaultValue: "per_person",
          width: "w-28",
          options: [
            { value: "per_person", label: "Per Person" },
            { value: "flat", label: "Flat Fee" },
            { value: "per_dozen", label: "Per Dozen" },
          ],
        },
        {
          key: "min_quantity",
          header: "Min Qty",
          type: "number",
          nullable: true,
          placeholder: "2",
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
