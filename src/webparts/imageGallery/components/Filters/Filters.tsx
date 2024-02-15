import { ActionButton, Pivot, PivotItem } from "@fluentui/react";
import * as React from "react";
import { IFilterItem } from "../../../../models/IFilterItem";

interface IProps {
  setSelectedFilter(value: React.SetStateAction<string | undefined>): void;
  filterItems: IFilterItem[];
  defaultSelectedKey: string;
}

export const Filters = ({ setSelectedFilter, defaultSelectedKey, filterItems }: IProps) => {
  if (!filterItems.length) return <></>;
  return (
    <div>
      <ActionButton
        iconProps={{ iconName: "filter" }}
        styles={{ root: { "@media screen and (min-width: 640px)": { display: "none" } } }}
        menuProps={{
          items: filterItems,
          onItemClick(ev, item) {
            setSelectedFilter(item?.itemProp);
          },
        }}
      />
      <Pivot
        styles={{ root: { "@media screen and (max-width: 640px)": { display: "none" } } }}
        onLinkClick={(item) => setSelectedFilter(item?.props.itemProp || "")}
        defaultSelectedKey={defaultSelectedKey}
      >
        {filterItems.map((key) => (
          <PivotItem {...key} />
        ))}
      </Pivot>
    </div>
  );
};
