import { TextField, Link, ActionButton, Text } from "@fluentui/react";
import * as React from "react";
import styles from "./BasicHeader.module.scss";
import { DisplayMode } from "@microsoft/sp-core-library";
import { ConfigContext } from "../../../../context/ConfigContext";
import { submitButtonStyles } from "./fluentui.styles";
import { Filters } from "../Filters/Filters";

export interface IProps {
  onChangeHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
  headerText: string;
  displayMode: DisplayMode;
  showFilters?: boolean;
  setFilterQuery(value: React.SetStateAction<string | undefined>): void;
}

export const BasicHeader = ({
  displayMode,
  headerText,
  onChangeHeader,
  showFilters = false,
  setFilterQuery,
}: IProps): JSX.Element => {
  const { showSubmit, showSeeAll, filters, defaultFilter } = React.useContext(ConfigContext);
  const isEditMode = displayMode === DisplayMode.Edit;
  const showHeader = displayMode === DisplayMode.Read && !!headerText;
  return (
    <div className={styles.basicHeader}>
      <div className={styles.topRow}>
        {isEditMode && (
          <TextField
            borderless
            styles={{ root: { paddingLeft: 0, flexGrow: 1 }, field: { fontSize: 20, paddingLeft: 0, fontWeight: 600 } }}
            placeholder="Enter a header"
            onChange={onChangeHeader}
            value={headerText}
          />
        )}
        {showHeader && (
          <Text variant="xLarge" block nowrap styles={{ root: { fontWeight: 600 } }}>
            {headerText}
          </Text>
        )}
        {showSeeAll && <Link style={{ marginLeft: "auto", minWidth: 40 }}>See all</Link>}
      </div>
      <div className={styles.bottomRow}>
        {showSubmit && (
          <div className={`${showFilters ? styles.absolute + " " : ""}${styles.buttonContainer}`}>
            <ActionButton styles={submitButtonStyles} key="hi" iconProps={{ iconName: "Add" }} text="Submit a Photo" />
          </div>
        )}
        {showFilters && (
          <div className={styles.pivotContainer}>
            <Filters
              defaultSelectedKey={defaultFilter?.itemKey || ""}
              filterItems={filters}
              setSelectedFilter={setFilterQuery}
            />
          </div>
        )}
      </div>
    </div>
  );
};
