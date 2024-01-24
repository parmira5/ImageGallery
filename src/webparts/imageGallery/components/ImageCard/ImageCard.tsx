import * as React from "react";
import styles from "./ImageCard.module.scss";
import { ImageHelper } from "@microsoft/sp-image-helper";
import { imageService } from "../../../../services/imageService";
import { Icon, Text } from "@fluentui/react";
import { chatIconStyles, textStyles } from "./fluentui.styles";

interface IImageDetails {
  id: number;
  title: string;
  description: string;
}

const ImageDetails = ({ description, title, id }: IImageDetails) => {
  const [commentCount, setCommentCount] = React.useState<number>(0);
  React.useState(() => {
    imageService
      .getComments(id)
      .then((res) => setCommentCount(res.length))
      .catch(console.error);
  });

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
  onClick(imageId: number): void;
}

const ImageCard = ({ src, description, title, id, onClick }: IImageCard) => {
  const resizedImage = ImageHelper.convertToImageUrl({ sourceUrl: src, width: 400, height: 500 });
  return (
    <div tabIndex={0} className={styles.imageCard} onClick={handeImageCardClick}>
      <ImageDetails id={id} description={description} title={title} />
      <img src={resizedImage} alt="Test" />
    </div>
  );

  function handeImageCardClick() {
    onClick(id);
  }
};

export default ImageCard;
