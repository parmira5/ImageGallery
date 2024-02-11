import * as React from "react";
import { Filter, IFilter } from "./Filter";
import { Guid } from "@microsoft/sp-core-library";
import { PrimaryButton } from "@fluentui/react";
import { findIndex } from "lodash";

export interface IProps {
    filters: IFilter[];
    onChange: (filters: IFilter[]) => void
}

export const FilterPicker = ({ filters, onChange }: IProps) => {
    return <div>
        <div>
            {filters.map(filter => <Filter filter={filter} onChange={handleChangeFilter} onDelete={handleDelete} />)}
        </div>
        <PrimaryButton text="Add Filter" onClick={handleAddFilter} styles={{ root: { marginTop: "1em" } }} />
    </div>

    function handleAddFilter() {
        onChange([...filters, createNewFilter()])
    }

    function handleChangeFilter(filter: IFilter) {
        const idx = findIndex(filters, (_filter) => _filter.id === filter.id);
        const filtersCopy = [...filters];
        filtersCopy[idx] = filter;
        onChange(filtersCopy)
    }

    function handleDelete(id: string) {
        const filtersCopy = [...filters];
        const idx = findIndex(filters, (_filter) => _filter.id === id);
        if (idx !== -1) {
            filtersCopy.splice(idx, 1)
        }
        onChange(filtersCopy)
    }
}

export function createNewFilter(): IFilter {
    return { id: Guid.newGuid().toString(), filterProperty: "test", filterType: "All", filterValue: "test", valueType: "Static", verticalName: "", operator: "EQUALS" }
}