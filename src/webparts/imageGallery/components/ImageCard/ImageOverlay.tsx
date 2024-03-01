import { IFontStyles, Icon, Text } from "@fluentui/react";
import * as React from "react";
import styles from "./ImageCard.module.scss";
import { chatIconStyles, textStyles } from "./fluentui.styles";

interface IImageOverlay {
  id: number;
  description: string;
  commentCount: number;
  fontVariation: keyof IFontStyles;
}

export const ImageOverlay = ({ description, commentCount, fontVariation }: IImageOverlay): JSX.Element => {
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
      <Text variant={fontVariation} styles={textStyles}>
        {description}
      </Text>
    </div>
  );
};
