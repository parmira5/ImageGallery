import { Text, DefaultButton, PrimaryButton } from "@fluentui/react";
import * as React from "react";
import { userService } from "../../../../services/userService";
import { mobileUsernameStyles, photoBtnStyles } from "./fluentui.styles";
import { controlPanelButtonStyles, usernameStyles } from "./fluentui.styles";
import styles from "./GalleryHeader.module.scss";
import Config from "../../../../models/Config";

interface IProps {
  onClickFilterButton: (selectedKey: string) => void;
  onSettingsButtonClick: () => void;
  onSubmitPhotoButtonClick: () => void;
  selectedCategory: string;
  showAdminControls: boolean;
  config: Config;
}

export const GalleryHeader = ({
  onSettingsButtonClick,
  onSubmitPhotoButtonClick,
  showAdminControls,
  onClickFilterButton,
  config,
}: IProps): JSX.Element => {
  const { DisableTagging } = config;
  return (
    <div className={styles.galleryHeader}>
      <div className={styles.bannerPhoto}>
        <div className={styles.bannerContentContainer}>
          <img className={styles.profilePhoto} src={userService.getCurrentUserPhoto("L")} />
          <Text styles={mobileUsernameStyles} variant="xLarge">
            {userService.currentUser().displayName}
          </Text>
          {showAdminControls && (
            <PrimaryButton
              styles={{ root: { marginLeft: "auto", marginRight: 8, minWidth: 20 } }}
              iconProps={{ iconName: "Settings" }}
              onClick={onSettingsButtonClick}
            />
          )}
        </div>
      </div>
      <div className={styles.controlPanel}>
        <Text styles={usernameStyles} variant="xLarge">
          {userService.currentUser().displayName}
        </Text>
        <div className={styles.postCount}>
          <DefaultButton onClick={() => onClickFilterButton("MINE")} styles={controlPanelButtonStyles}>
            Posts: 32
          </DefaultButton>
        </div>
        <div className={styles.postCount}>
          {!DisableTagging && (
            <DefaultButton onClick={() => onClickFilterButton("TAGGED")} styles={controlPanelButtonStyles}>
              Tagged: 12
            </DefaultButton>
          )}
        </div>
        <PrimaryButton
          styles={photoBtnStyles}
          iconProps={{ iconName: "Photo2Add" }}
          onClick={onSubmitPhotoButtonClick}
        />
      </div>
    </div>
  );
};
