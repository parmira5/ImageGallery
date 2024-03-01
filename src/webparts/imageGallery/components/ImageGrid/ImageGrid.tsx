import { ActionButton, Spinner, SpinnerSize } from "@fluentui/react";
import * as React from "react";
import { Post } from "../../../../models/Post";
import ImageCard from "../ImageCard/ImageCard";
import { ImageOverlay } from "../ImageCard/ImageOverlay";
import { pageBtnIcon } from "./fluentui.props";
import { pageBtnStyles } from "./fluentui.styles";
import styles from "./ImageGrid.module.scss";
import { LOAD_MORE } from "./strings";
import { ConfigContext } from "../../../../context/ConfigContext";
import { ImageGridShimmer } from "./ImageGridShimmer";
import { columnCountDict } from "./helpers";

export interface IProps {
  posts: Post[];
  hasNext: boolean;
  onClickItem: (post: Post) => void;
  onClickMore: () => void;
  isLoading: boolean;
  isNextPageLoading: boolean;
}

export const ImageGrid = ({
  posts,
  onClickItem,
  onClickMore,
  hasNext,
  isLoading,
  isNextPageLoading,
}: IProps): JSX.Element => {
  const { columnCount, showPaginationControl } = React.useContext(ConfigContext);
  if (isLoading) return <ImageGridShimmer />;
  return (
    <section className={styles.imageGridWrapper}>
      {posts.map((post) => {
        if (post.id)
          return (
            <div
              key={post.id}
              className={styles.imageCardWrapper}
              style={{ minWidth: columnCountDict[columnCount], maxWidth: columnCountDict[columnCount] }}
            >
              <ImageCard key={post.id} onClick={onClickItem} id={post.id} post={post}>
                <ImageOverlay
                  id={post.id}
                  description={post.description}
                  commentCount={post.comments.commentCount}
                  fontVariation="mediumPlus"
                />
              </ImageCard>
            </div>
          );
      })}
      {hasNext && showPaginationControl && (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {!isNextPageLoading && (
            <ActionButton styles={pageBtnStyles} iconProps={pageBtnIcon} text={LOAD_MORE} onClick={onClickMore} />
          )}
          {isNextPageLoading && <Spinner styles={{ root: { marginTop: 10 } }} size={SpinnerSize.large} />}
        </div>
      )}
    </section>
  );
};
