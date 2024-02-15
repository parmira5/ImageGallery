import React from "react";
import { AppType } from "../models/AppType";
import { IFilterItem } from "../models/IFilterItem";
import { ColumnCount } from "../models/ColumnCount";

export interface IConfigContext {
  carouselHeader: string;
  appType: AppType;
  columnCount: ColumnCount;
  showSeeAll: boolean;
  showSubmit: boolean;
  pageSize: number;
  showPaginationControl: boolean;
  filters: IFilterItem[];
  defaultFilter: IFilterItem | null;
  baseQuery: string;
  commentsDisabled: boolean;
  taggingDisabled: boolean;
}

export const ConfigContext = React.createContext<IConfigContext>({
  carouselHeader: "",
  appType: AppType.Grid,
  columnCount: 3,
  showSeeAll: true,
  showSubmit: true,
  pageSize: 9,
  showPaginationControl: true,
  filters: [],
  defaultFilter: null,
  baseQuery: "",
  commentsDisabled: false,
  taggingDisabled: false,
});
