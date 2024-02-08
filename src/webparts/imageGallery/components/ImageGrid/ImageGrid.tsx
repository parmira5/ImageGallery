import { ActionButton, Shimmer } from "@fluentui/react";
import * as React from "react";
import { Post } from "../../../../models/Post";
import ImageCard from "../ImageCard/ImageCard";
import { ImageOverlay } from "../ImageCard/ImageOverlay";
import { pageBtnIcon } from "./fluentui.props";
import { pageBtnStyles, shimmerStyles } from "./fluentui.styles";
import styles from "./ImageGrid.module.scss";
import { LOAD_MORE } from "./strings";

export interface IProps {
  posts: Post[];
  hasNext: boolean;
  onClickItem: (post: Post) => void;
  onClickMore: () => void;
  isLoading: boolean;
}

export const ImageGrid = ({ posts, onClickItem, onClickMore, hasNext, isLoading }: IProps): JSX.Element => {
  if (isLoading) return <ImageGridShimmer />;
  return (
    <section className={styles.imageGridWrapper}>
      {posts.map((post) => (
        <div key={post.id} className={styles.imageCardWrapper}>
          <ImageCard key={post.id} onClick={onClickItem} id={post.id} post={post}>
            <ImageOverlay
              id={post.id}
              description={post.description}
              title={post.title}
              commentCount={post.comments.commentCount}
              fontVariation="mediumPlus"
            />
          </ImageCard>
        </div>
      ))}
      {hasNext && (
        <ActionButton styles={pageBtnStyles} iconProps={pageBtnIcon} text={LOAD_MORE} onClick={onClickMore} />
      )}
    </section>
  );
};

function ImageGridShimmer(): JSX.Element {
  return (
    <div className={`${styles.imageGridWrapper} ${styles.shimmerWrapper}`}>
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
      <Shimmer styles={shimmerStyles} />
    </div>
  );
}
