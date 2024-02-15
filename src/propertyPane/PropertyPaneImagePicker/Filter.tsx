import * as React from "react";
import styles from "./FilterPicker.module.scss";
import {
  ActionButton,
  Checkbox,
  ChoiceGroup,
  Dropdown,
  IChoiceGroupOption,
  IDropdownOption,
  ISelectableOption,
  TextField,
} from "@fluentui/react";
import { listService } from "../../services/listService";
import { IFilter, Operator } from "../../models/IFilter";

interface IOperatorOption extends ISelectableOption {
  key: Operator;
}

const operators: IOperatorOption[] = [
  { key: "eq", text: "Equals" },
  { key: "contains", text: "Contains" },
  { key: "gt", text: "Greater Than" },
  { key: "lt", text: "Less Than" },
  { key: "ne", text: "Doesn't Equal" },
  { key: "startsWith", text: "Begins With" },
];

interface IProps {
  filter: IFilter;
  onChange: (filter: IFilter) => void;
  onDelete: (id: string) => void;
}

export function Filter({ filter, onChange, onDelete }: IProps): JSX.Element {
  const [columns, setColumns] = React.useState<IDropdownOption[]>([]);
  const { filterProperty, filterType, filterValue, valueType, verticalName, operator, isNoFilter, isDefault } = filter;

  const isDynamic = valueType === "Dynamic";
  const isVertical = filterType === "Vertical";

  React.useEffect(() => {
    listService.getColumns("Image Gallery").then(setColumns);
  }, []);

  return (
    <div id={filter.id} key={filter.id} className={styles.container}>
      <ChoiceGroup
        defaultSelectedKey={filterType}
        label="Filter type"
        options={[
          { key: "All", text: "Apply to All" },
          { key: "Vertical", text: "Add as Vertical" },
        ]}
        styles={{
          flexContainer: { display: "flex", gap: "1.5em", flexDirection: "row" },
          root: { marginBottom: "1em" },
        }}
        onChange={handleFilterTypeChange}
      />
      {isVertical && (
        <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <Checkbox label="No filter" onChange={handleChangeNoFilter} checked={isNoFilter} />{" "}
          <Checkbox label="Make default" onChange={handleCheckDefault} checked={isDefault} />
        </div>
      )}
      {isVertical && <TextField label="Filter display name" value={verticalName} onChange={handleChangeVerticalName} />}
      {!isNoFilter && (
        <>
          <Dropdown
            options={columns}
            label="Filter property"
            selectedKey={filterProperty}
            onChange={handleChangeFilterProperty}
          />
          <Dropdown options={operators} label="Operator" selectedKey={operator} onChange={handleChangeOperator} />
          <ChoiceGroup
            defaultSelectedKey={valueType}
            label="Value type"
            options={[
              { key: "Static", text: "Static" },
              { key: "Dynamic", text: "Dynamic" },
            ]}
            styles={{ flexContainer: { display: "flex", gap: "1.5em", flexDirection: "row" } }}
            onChange={handleValueTypeChange}
          />
          {!isDynamic && <TextField value={filterValue.toString()} onChange={handleStaticValueChange} label="Value" />}
          {isDynamic && (
            <Dropdown
              options={[
                { key: "USER_EMAIL", text: "User's Email" },
                { key: "TODAY", text: "Today's Date" },
              ]}
              selectedKey={filterValue}
              onChange={handleDynamicValueChange}
              label="Value"
            />
          )}
        </>
      )}
      <ActionButton
        iconProps={{ iconName: "Delete" }}
        text="Delete"
        styles={{ root: { paddingLeft: 0, marginTop: "1em", marginLeft: "auto" }, icon: { marginLeft: 0 } }}
        onClick={handleDelete}
      />
    </div>
  );

  function handleValueTypeChange(
    ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option?: IChoiceGroupOption | undefined
  ): void {
    if (option && (option.key === "Static" || option.key === "Dynamic")) {
      onChange({ ...filter, valueType: option.key });
    }
  }

  function handleFilterTypeChange(
    ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option?: IChoiceGroupOption | undefined
  ): void {
    if (option && (option.key === "All" || option.key === "Vertical")) {
      onChange({ ...filter, filterType: option.key, verticalName: option.key === "All" ? "" : verticalName });
    }
  }

  function handleStaticValueChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    onChange({ ...filter, filterValue: newValue || "" });
  }

  function handleDynamicValueChange(
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption | undefined,
    index?: number | undefined
  ): void {
    if (option) onChange({ ...filter, filterValue: option.key });
  }

  function handleChangeFilterProperty(
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption | undefined,
    index?: number | undefined
  ): void {
    if (option) onChange({ ...filter, filterProperty: option.key.toString() });
  }

  function handleChangeVerticalName(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    onChange({ ...filter, verticalName: newValue || "" });
  }

  function handleChangeOperator(
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption | undefined,
    index?: number | undefined
  ): void {
    if (option && option.key) {
      onChange({ ...filter, operator: option.key as Operator });
    }
  }

  function handleChangeNoFilter(
    ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    checked?: boolean | undefined
  ): void {
    onChange({ ...filter, isNoFilter: !!checked, filterProperty: "", filterValue: "" });
  }

  function handleDelete(): void {
    onDelete(filter.id);
  }

  function handleCheckDefault(
    ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
    checked?: boolean | undefined
  ): void {
    onChange({ ...filter, isDefault: !!checked });
  }
}
