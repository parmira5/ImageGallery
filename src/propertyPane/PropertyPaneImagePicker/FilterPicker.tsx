import * as React from "react";
import { Filter } from "./Filter";
import { Guid } from "@microsoft/sp-core-library";
import { ActionButton } from "@fluentui/react";
import { findIndex } from "lodash";
import { IFilter } from "../../models/IFilter";

export interface IProps {
  filters: IFilter[];
  onChange: (filters: IFilter[]) => void;
}

export const FilterPicker = ({ filters, onChange }: IProps) => {
  return (
    <div>
      <div>
        {filters.map((filter) => (
          <Filter filter={filter} onChange={handleChangeFilter} onDelete={handleDelete} />
        ))}
      </div>
      <ActionButton
        iconProps={{ iconName: "Add" }}
        text="Add Filter"
        onClick={handleAddFilter}
        styles={{ root: { marginTop: "1em" } }}
      />
    </div>
  );

  function handleAddFilter() {
    onChange([...filters, createNewFilter()]);
  }

  function handleChangeFilter(filter: IFilter) {
    const idx = findIndex(filters, (_filter) => _filter.id === filter.id);
    let filtersCopy = [...filters];
    console.log(filter.isDefault);
    if (filter.isDefault) {
      filtersCopy = filtersCopy.map((f) => {
        f.isDefault = false;
        return f;
      });
    }
    filtersCopy[idx] = filter;
    console.log(filtersCopy);
    onChange(filtersCopy);
  }

  function handleDelete(id: string) {
    const filtersCopy = [...filters];
    const idx = findIndex(filters, (_filter) => _filter.id === id);
    if (idx !== -1) {
      filtersCopy.splice(idx, 1);
    }
    onChange(filtersCopy);
  }
};

export function createNewFilter(): IFilter {
  return {
    filterType: "All",
    id: Guid.newGuid().toString(),
    filterProperty: "",
    filterValue: "",
    valueType: "Static",
    operator: "eq",
    isNoFilter: false,
    isDefault: false,
    verticalName: "",
  };
}
