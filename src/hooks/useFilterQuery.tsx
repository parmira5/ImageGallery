import * as React from "react";
import { IFilter } from "../models/IFilter";

function buildQuery(filter: IFilter) {
  if (filter.operator === "startsWith" || filter.operator === "contains") {
    return `${filter.operator}(${filter.filterProperty}, '${filter.filterValue}')`;
  }
  return `${filter.filterProperty} ${filter.operator} '${filter.filterValue}'`;
}

export const useFilters = (filters: IFilter[]) => {
  const [selectedFilter, setSelectedFilter] = React.useState("");
  const [filterQuery, setFilterQuery] = React.useState("");
  const [filterKeys, setFilterKeys] = React.useState<string[]>([]);

  React.useEffect(() => {
    setFilterKeys(filters.filter((filter) => filter.filterType === "Vertical").map((filter) => filter.verticalName));
    const filter = filters.find((filter) => filter.verticalName === selectedFilter);
    if (filter) {
      const queryString = filter.isNoFilter ? "" : buildQuery(filter);
      setFilterQuery(queryString);
    } else {
      setFilterQuery("");
    }
  }, [selectedFilter]);

  return [filterKeys, filterQuery, setSelectedFilter] as const;
};

// setBaseQuery(filters
//     .filter((filter) => filter.filterType === "All" && !!filter.filterValue)
//     .map((filter) => buildQuery(filter))
//     .join(" and "))
