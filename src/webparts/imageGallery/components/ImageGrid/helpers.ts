import { ColumnCount } from "../../../../models/ColumnCount";

export const columnCountDict = {
  [ColumnCount.One]: "100%",
  [ColumnCount.Two]: "calc(50% - 1px)",
  [ColumnCount.Three]: "calc(33.33% - 1px)",
  [ColumnCount.Four]: "calc(25% - 1px)",
  [ColumnCount.Five]: "calc(20% - 1px)",
};
