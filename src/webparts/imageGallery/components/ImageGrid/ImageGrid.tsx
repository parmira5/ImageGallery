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
  [ColumnCount.One]: "100%",
  [ColumnCount.Two]: "calc(50% - 1px)",
  [ColumnCount.Three]: "calc(33.33% - 1px)",
  [ColumnCount.Four]: "calc(25% - 1px)",
  [ColumnCount.Five]: "calc(20% - 1px)",
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
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <ActionButton styles={pageBtnStyles} iconProps={pageBtnIcon} text={LOAD_MORE} onClick={onClickMore} />
        </div>
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
