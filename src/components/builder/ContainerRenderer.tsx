import type { BuilderContainer, ColumnLayout } from "@/lib/builder-types";
import ElementRenderer from "./ElementRenderer";

const columnGridClass: Record<ColumnLayout, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function ContainerRenderer({
  container,
}: {
  container: BuilderContainer;
}) {
  return (
    <section className="py-8 md:py-12">
      <div className={`mx-auto max-w-6xl px-4 grid ${columnGridClass[container.columnLayout]} gap-8`}>
        {container.columns.map((column) => (
          <div key={column.id}>
            {column.elements.map((element) => (
              <ElementRenderer key={element.id} element={element} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
