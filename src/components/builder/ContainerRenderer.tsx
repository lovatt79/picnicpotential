import type { BuilderContainer, ColumnLayout, ContainerBgColor } from "@/lib/builder-types";
import { normalizeContainer } from "@/lib/builder-types";
import ElementRenderer from "./ElementRenderer";

const columnGridClass: Record<ColumnLayout, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

const bgColorClass: Record<ContainerBgColor, string> = {
  "": "",
  white: "bg-white",
  sage: "bg-sage",
  "sage-light": "bg-sage-light/30",
  charcoal: "bg-charcoal",
  "gold-light": "bg-gold-light",
};

export default function ContainerRenderer({
  container: rawContainer,
}: {
  container: BuilderContainer;
}) {
  const container = normalizeContainer(rawContainer);
  const bg = bgColorClass[container.bgColor || ""] || "";
  const isCharcoal = container.bgColor === "charcoal";

  return (
    <section className={`py-8 md:py-12 ${bg}`}>
      <div className="mx-auto max-w-6xl px-4 space-y-8">
        {container.rows.map((row) => (
          <div
            key={row.id}
            className={`grid ${columnGridClass[row.columnLayout]} gap-8`}
          >
            {row.columns.map((column) => (
              <div key={column.id} className={isCharcoal ? "text-white" : ""}>
                {column.elements.map((element) => (
                  <ElementRenderer key={element.id} element={element} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
