import * as React from "react";
import styles from "./ImageCard.module.scss";
import { ImageHelper } from "@microsoft/sp-image-helper";
import { Icon, Text } from "@fluentui/react";
import { chatIconStyles, textStyles } from "./fluentui.styles";

interface IImageOverlay {
  id: number;
  title: string;
  description: string;
  commentCount: number;
}

const ImageOverlay = ({ description, title, id, commentCount }: IImageOverlay): JSX.Element => {
  return (
    <div className={styles.imageDetails}>
      <div className={styles.commentDetails}>
        <Icon styles={chatIconStyles} iconName="CommentSolid" />
        <Text styles={textStyles} variant="xLarge">
          {commentCount}
        </Text>
      </div>
      <Text variant="mediumPlus" styles={textStyles}>
        {description}
      </Text>
    </div>
  );
};

interface IImageCard {
  id: number;
  src: string;
  title: string;
  description: string;
  commentCount: number;
  onClick(imageId: number): void;
  fetchImageCommentCount(imageId: number): void;
}

const ImageCard = ({
  src,
  description,
  title,
  id,
  commentCount,
  onClick,
  fetchImageCommentCount,
}: IImageCard): JSX.Element => {
  React.useEffect(() => {
    fetchImageCommentCount(id);
  }, []);

  const resizedImage = ImageHelper.convertToImageUrl({
    sourceUrl: src,
    width: 400,
    height: 500,
  });
  return (
    <div tabIndex={0} className={styles.imageCard} onClick={handeImageCardClick}>
      <ImageOverlay id={id} description={description} title={title} commentCount={commentCount} />
      <img src={resizedImage} alt="Test" />
    </div>
  );

  function handeImageCardClick(): void {
    onClick(id);
  }
};

export default ImageCard;
