export interface IFilter {
  id: string;
  filterType: "All" | "Vertical";
  verticalName: string;
  valueType: "Dynamic" | "Static";
  filterValue: string | number;
  filterProperty: string;
  operator: Operator;
  isNoFilter?: boolean;
}

export type Operator = "eq" | "ne" | "contains" | "startsWith" | "lt" | "gt";
