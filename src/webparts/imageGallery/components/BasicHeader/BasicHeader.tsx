import { TextField, Link, ActionButton, PrimaryButton } from "@fluentui/react";
import * as React from "react";
import styles from "./BasicHeader.module.scss";
import { DisplayMode } from "@microsoft/sp-core-library";

interface IProps {
  onClickSettings: () => void;
  onChangeHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
  headerText: string;
  displayMode: DisplayMode;
}

export const BasicHeader = ({ displayMode, headerText, onChangeHeader, onClickSettings }: IProps) => {
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
        <Link style={{ marginLeft: "auto" }}>See all</Link>
      </div>
      <div className={styles.topRow}>
        <ActionButton
          styles={{ root: { paddingLeft: 0, marginBottom: 10 }, icon: { marginLeft: 0 } }}
          key="hi"
          iconProps={{ iconName: "Add" }}
          text="Submit a Photo"
        />
        <PrimaryButton
          styles={{ root: { minWidth: 50 } }}
          iconProps={{ iconName: "Settings" }}
          onClick={onClickSettings}
        />
      </div>
    </div>
  );
};
