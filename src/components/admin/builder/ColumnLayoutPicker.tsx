"use client";

import type { ColumnLayout } from "@/lib/builder-types";

const layouts: { value: ColumnLayout; label: string; bars: number[] }[] = [
  { value: 1, label: "1 Column", bars: [1] },
  { value: 2, label: "2 Columns", bars: [1, 1] },
  { value: 3, label: "3 Columns", bars: [1, 1, 1] },
  { value: 4, label: "4 Columns", bars: [1, 1, 1, 1] },
];

export default function ColumnLayoutPicker({
  value,
  onChange,
}: {
  value: ColumnLayout;
  onChange: (layout: ColumnLayout) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {layouts.map((layout) => (
        <button
          key={layout.value}
          type="button"
          onClick={() => onChange(layout.value)}
          title={layout.label}
          className={`flex items-center gap-0.5 p-1.5 rounded transition-colors ${
            value === layout.value
              ? "bg-gold/20 text-gold"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }`}
        >
          {layout.bars.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-4 rounded-sm ${
                value === layout.value ? "bg-gold" : "bg-current"
              }`}
            />
          ))}
        </button>
      ))}
    </div>
  );
}
