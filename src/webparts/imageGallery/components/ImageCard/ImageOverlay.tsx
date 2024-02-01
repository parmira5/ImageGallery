import { Icon, Text } from "@fluentui/react";
import * as React from "react";
import styles from "./ImageCard.module.scss";
import { chatIconStyles, textStyles } from "./fluentui.styles";

interface IImageOverlay {
  id: number;
  title: string;
  description: string;
  commentCount: number;
}

export const ImageOverlay = ({ description, title, id, commentCount }: IImageOverlay): JSX.Element => {
  return (
    <div className={styles.imageOverlay}>
      {commentCount > 0 ? (
        <div className={styles.commentDetails}>
          <Icon styles={chatIconStyles} iconName="CommentSolid" />
          <Text styles={textStyles} variant="xLarge">
            {commentCount}
          </Text>
        </div>
      ) : (
        <></>
      )}
      <Text variant="mediumPlus" styles={textStyles}>
        {description}
      </Text>
    </div>
  );
};
