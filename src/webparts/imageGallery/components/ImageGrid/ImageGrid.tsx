import { ActionButton } from "@fluentui/react";
import * as React from "react";
import { Post } from "../../../../models/Post";
import ImageCard from "../ImageCard/ImageCard";
import { ImageOverlay } from "../ImageCard/ImageOverlay";
import { pageBtnIcon } from "./fluentui.props";
import { pageBtnStyles } from "./fluentui.styles";
import styles from "./ImageGrid.module.scss";
import { LOAD_MORE } from "./strings";

interface IProps {
  posts: Post[];
  hasNext: boolean;
  onClickItem: (post: Post) => void;
  onClickMore: () => void;
}

export const ImageGrid = ({ posts, onClickItem, onClickMore, hasNext }: IProps): JSX.Element => {
  return (
    <section className={styles.imageGridWrapper}>
      {posts.map((post) => (
        <ImageCard key={post.id} onClick={onClickItem} id={post.id} post={post}>
          <ImageOverlay
            id={post.id}
            description={post.description}
            title={post.title}
            commentCount={post.comments.commentCount}
          />
        </ImageCard>
      ))}
      {hasNext && (
        <ActionButton styles={pageBtnStyles} iconProps={pageBtnIcon} text={LOAD_MORE} onClick={onClickMore} />
      )}
    </section>
  );
};
