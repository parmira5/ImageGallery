import * as React from "react";
import styles from "./FilterPicker.module.scss";
import { ActionButton, ChoiceGroup, Dropdown, IChoiceGroupOption, IDropdownOption, ISelectableOption, TextField } from "@fluentui/react";

type Operator = "EQUALS" | "NOTEQUALS" | "CONTAINS" | "STARTSWITH" | "LESSTHAN" | "GREATERTHAN";

interface IOperatorOption extends ISelectableOption {
  key: Operator
}

const operators: IOperatorOption[] = [
  { key: "EQUALS", text: "Equals" },
  { key: "CONTAINS", text: "Contains" },
  { key: "GREATERTHAN", text: "Greater Than" },
  { key: "LESSTHAN", text: "Less Than" },
  { key: "NOTEQUALS", text: "Doesn't Equal" },
  { key: "STARTSWITH", text: "Begins With" },
]

export interface IFilter {
  id: string,
  filterType: "All" | "Vertical",
  verticalName: string,
  valueType: "Dynamic" | "Static",
  filterValue: string | number,
  filterProperty: string;
  operator: Operator;
}


interface IProps {
  filter: IFilter;
  onChange: (filter: IFilter) => void;
  onDelete: (id: string) => void;
}

export function Filter({ filter, onChange, onDelete }: IProps): JSX.Element {
  const { filterProperty, filterType, filterValue, valueType, verticalName, operator } = filter;

  const isDynamic = valueType === "Dynamic";
  const isVertical = filterType === "Vertical";

  return (
    <div id={filter.id} key={filter.id} className={styles.container}>
      <ChoiceGroup defaultSelectedKey={filterType} label="Filter type" options={[{ key: "All", text: "Apply to All" }, { key: "Vertical", text: "Add as Vertical" }]} styles={{ flexContainer: { display: "flex", gap: "1.5em", flexDirection: "row" }, root: { marginBottom: "1em" } }} onChange={handleFilterTypeChange} />
      {isVertical && <TextField label="Filter display name" value={verticalName} onChange={handleChangeVerticalName} />}
      <Dropdown options={[{ key: "test", text: "test" }]} label="Filter property" selectedKey={filterProperty} onChange={handleChangeFilterProperty} />
      <Dropdown options={operators} label="Operator" selectedKey={operator} onChange={handleChangeOperator} />
      <ChoiceGroup defaultSelectedKey={valueType} label="Value type" options={[{ key: "Static", text: "Static" }, { key: "Dynamic", text: "Dynamic" }]} styles={{ flexContainer: { display: "flex", gap: "1.5em", flexDirection: "row" } }} onChange={handleValueTypeChange} />
      {!isDynamic && <TextField value={filterValue.toString()} onChange={handleStaticValueChange} label="Value" />}
      {isDynamic && <Dropdown options={[{ key: "test", text: "test" }]} selectedKey={filterValue} onChange={handleDynamicValueChange} label="Value" />}
      <ActionButton iconProps={{ iconName: "Delete" }} text="Delete" styles={{ root: { paddingLeft: 0, marginTop: "1em", marginLeft: "auto" }, icon: { marginLeft: 0 } }} onClick={handleDelete} />
    </div>
  );

  function handleValueTypeChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option?: IChoiceGroupOption | undefined) {
    if (option && (option.key === "Static" || option.key === "Dynamic")) {
      onChange({ ...filter, valueType: option.key })
    }
  }

  function handleFilterTypeChange(ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined, option?: IChoiceGroupOption | undefined) {
    if (option && (option.key === "All" || option.key === "Vertical")) {
      onChange({ ...filter, filterType: option.key, verticalName: option.key === "All" ? "" : verticalName })
    }
  }

  function handleStaticValueChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) {
    onChange({ ...filter, filterValue: newValue || "" })
  }

  function handleDynamicValueChange(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) {
    if (option)
      onChange({ ...filter, filterValue: option.key, })
  }

  function handleChangeFilterProperty(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<any> | undefined, index?: number | undefined) {
    if (option)
      onChange({ ...filter, filterProperty: option.key.toString() })
  }

  function handleChangeVerticalName(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) {
    onChange({ ...filter, verticalName: newValue || "" })
  }

  function handleChangeOperator(event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption<IOperatorOption> | undefined, index?: number | undefined) {
    if (option && option.key) {
      onChange({ ...filter, operator: option.key as Operator })
    }
  }

  function handleDelete() {
    onDelete(filter.id)
  }
}
