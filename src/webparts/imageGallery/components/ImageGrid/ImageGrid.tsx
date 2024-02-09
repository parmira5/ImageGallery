import { ActionButton, Shimmer } from "@fluentui/react";
import * as React from "react";
import { Post } from "../../../../models/Post";
import ImageCard from "../ImageCard/ImageCard";
import { ImageOverlay } from "../ImageCard/ImageOverlay";
import { pageBtnIcon } from "./fluentui.props";
import { pageBtnStyles, shimmerStyles } from "./fluentui.styles";
import styles from "./ImageGrid.module.scss";
import { LOAD_MORE } from "./strings";
import { ConfigContext } from "../../../../context/ConfigContext";
import { ColumnCount } from "../../../../models/ColumnCount";

export interface IProps {
  posts: Post[];
  hasNext: boolean;
  onClickItem: (post: Post) => void;
  onClickMore: () => void;
  isLoading: boolean;
}

const columnCountDict = {
  [ColumnCount.Two]: "49.8%",
  [ColumnCount.Three]: "33.1%",
  [ColumnCount.Four]: "24.7%",
  [ColumnCount.Five]: "19.6%",
};

export const ImageGrid = ({ posts, onClickItem, onClickMore, hasNext, isLoading }: IProps): JSX.Element => {
  const { columnCount, showPaginationControl } = React.useContext(ConfigContext);
  if (isLoading) return <ImageGridShimmer />;
  return (
    <section className={styles.imageGridWrapper}>
      {posts.map((post) => (
        <div
          key={post.id}
          className={styles.imageCardWrapper}
          style={{ minWidth: columnCountDict[columnCount], maxWidth: columnCountDict[columnCount] }}
        >
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
      {hasNext && showPaginationControl && (
        <ActionButton styles={pageBtnStyles} iconProps={pageBtnIcon} text={LOAD_MORE} onClick={onClickMore} />
      )}
    </section>
  );
};

function ImageGridShimmer(): JSX.Element {
  const { columnCount, pageSize } = React.useContext(ConfigContext);

  return (
    <div className={`${styles.imageGridWrapper} ${styles.shimmerWrapper}`}>
      {Array(pageSize)
        .fill("")
        .map(() => (
          <Shimmer
            styles={shimmerStyles}
            style={{ minWidth: columnCountDict[columnCount], maxWidth: columnCountDict[columnCount] }}
          />
        ))}
    </div>
  );
}
