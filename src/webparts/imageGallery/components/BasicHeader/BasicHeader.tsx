import { TextField, Link, ActionButton } from "@fluentui/react";
import * as React from "react";
import styles from "./BasicHeader.module.scss";
import { DisplayMode } from "@microsoft/sp-core-library";
import { ConfigContext } from "../../../../context/ConfigContext";

export interface IProps {
  onClickSettings: () => void;
  onChangeHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
  headerText: string;
  displayMode: DisplayMode;
}

export const BasicHeader = ({ displayMode, headerText, onChangeHeader, onClickSettings }: IProps) => {
  const { showSubmit, showSeeAll } = React.useContext(ConfigContext);
  const showHeader = displayMode === DisplayMode.Edit || !!headerText;
  return (
    <div className={styles.basicHeader}>
      <div className={styles.topRow}>
        {showHeader && (
          <TextField
            borderless
            styles={{ root: { paddingLeft: 0 }, field: { fontSize: 20, paddingLeft: 0 } }}
            placeholder="Enter a header"
            onChange={onChangeHeader}
            value={headerText}
          />
        )}
        {showSeeAll && <Link style={{ marginLeft: "auto" }}>See all</Link>}
      </div>
      <div className={styles.topRow}>
        {showSubmit && (
          <ActionButton
            styles={{ root: { paddingLeft: 0, marginBottom: 10 }, icon: { marginLeft: 0 } }}
            key="hi"
            iconProps={{ iconName: "Add" }}
            text="Submit a Photo"
          />
        )}
      </div>
    </div>
  );
};
