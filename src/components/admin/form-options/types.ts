export type ColumnType = "text" | "number" | "select" | "toggle";

export interface ColumnDef {
  key: string;
  header: string;
  type: ColumnType;
  width?: string;
  placeholder?: string;
  required?: boolean;
  step?: string;
  nullable?: boolean;
  options?: { value: string; label: string }[];
  toggleColor?: string;
  defaultValue?: string | number | boolean | null;
}

export interface SortableOptionsTableProps {
  tableName: string;
  title: string;
  subtitle: string;
  columns: ColumnDef[];
  addButtonLabel: string;
  addFormTitle: string;
  deleteConfirmMessage?: string;
  backLink?: string;
}

export type OptionItem = Record<string, any> & {
  id: string;
  sort_order: number;
  is_active: boolean;
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";
