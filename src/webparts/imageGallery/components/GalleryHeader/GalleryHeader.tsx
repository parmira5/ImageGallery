import { Text, Pivot, PivotItem, DefaultButton, PrimaryButton } from "@fluentui/react";
import * as React from "react";
import { userService } from "../../../../services/userService";
import { mobileUsernameStyles, photoBtnStyles, pivotStyles } from "./fluentui.styles";
import { ALL } from "../strings";
import { controlPanelButtonStyles, usernameStyles } from "./fluentui.styles";
import styles from "./GalleryHeader.module.scss";

interface IProps {
  onSettingsButtonClick: () => void;
  onSubmitPhotoButtonClick: () => void;
  onPivotClick: (item?: PivotItem) => void;
}

export const GalleryHeader = ({ onSettingsButtonClick, onSubmitPhotoButtonClick, onPivotClick }: IProps): JSX.Element => {
  return (
    <div className={styles.galleryHeader}>
      <div className={styles.bannerPhoto}>
        <div className={styles.bannerContentContainer}>
          <img className={styles.profilePhoto} src={userService.getCurrentUserPhoto("L")} />
          <Text styles={mobileUsernameStyles} variant="xLarge">
            {userService.currentUser().displayName}
          </Text>
          <PrimaryButton
            styles={{ root: { marginLeft: "auto", marginRight: 8, minWidth: 20 } }}
            iconProps={{ iconName: "Settings" }}
            onClick={onSettingsButtonClick}
          />
        </div>
      </div>
      <div className={styles.controlPanel}>
        <Text styles={usernameStyles} variant="xLarge">
          {userService.currentUser().displayName}
        </Text>
        <div className={styles.postCount}>
          <DefaultButton styles={controlPanelButtonStyles}>Posts: 32</DefaultButton>
        </div>
        <div className={styles.postCount}>
          <DefaultButton styles={controlPanelButtonStyles}>Tagged: 12</DefaultButton>
        </div>
        <PrimaryButton
          styles={photoBtnStyles}
          iconProps={{ iconName: "Photo2Add" }}
          onClick={onSubmitPhotoButtonClick}
        />
      </div>
      <Pivot styles={pivotStyles} overflowBehavior="menu" onLinkClick={onPivotClick}>
        <PivotItem key={ALL} itemKey={ALL} headerText={ALL} />
        <PivotItem key={"MINE"} itemKey={"MINE"} headerText={"Mine"} />
        <PivotItem key={"TAGGED"} itemKey={"TAGGED"} headerText={"Tagged"} />
      </Pivot>
    </div>
  );
};
