import { ActionButton } from "@fluentui/react";
import * as React from "react";
import { photoButtonIcon, settingsButtonIcon } from "../fluentui.props";
import { SUBMIT_A_PHOTO, ADMIN_CONFIG } from "../strings";
import styles from "./Menu.module.scss";

interface IProps {
  isAdmin: boolean;
  onClickConfigBtn: () => void;
}

export const Menu = ({ isAdmin, onClickConfigBtn }: IProps): JSX.Element => {
  return (
    <div className={styles.menu}>
      <ActionButton iconProps={photoButtonIcon} text={SUBMIT_A_PHOTO} />
      {isAdmin && <ActionButton iconProps={settingsButtonIcon} text={ADMIN_CONFIG} onClick={onClickConfigBtn} />}
    </div>
  );
};
