import * as React from "react";
import styles from "./ImageCard.module.scss";
import { Post } from "../../../../models/Post";
interface IImageCard {
  id: number;
  post: Post;
  onClick(post: Post): void;
}

const ImageCard = ({ id, post, onClick, children }: React.PropsWithChildren<IImageCard>): JSX.Element => {
  return (
    <div tabIndex={0} className={styles.imageCard} onClick={handeImageCardClick}>
      {children}
      <img src={post.imageThumbnailPath} alt="Test" />
    </div>
  );

  function handeImageCardClick(): void {
    onClick(post);
  }
};

export default React.memo(ImageCard, (prevProps, newProps) => {
  return (
    prevProps.post.comments.commentCount === newProps.post.comments.commentCount &&
    prevProps.post.description === newProps.post.description &&
    prevProps.id === newProps.id &&
    prevProps.post.imagePath === newProps.post.imagePath
  );
});
