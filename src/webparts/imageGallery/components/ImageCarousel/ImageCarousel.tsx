import * as React from "react";
import { Post } from "../../../../models/Post";
import ImageCard from "../ImageCard/ImageCard";
import { ImageOverlay } from "../ImageCard/ImageOverlay";
import styles from "./ImageCarousel.module.scss";
import { useDraggable } from "react-use-draggable-scroll";
export interface IProps {
  posts: Post[];
  onClickItem: (post: Post) => void;
}

export const ImageCarousel = ({ posts, onClickItem }: IProps): JSX.Element => {
  const ref = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const { events } = useDraggable(ref, { applyRubberBandEffect: true });
  return (
    <div className={styles.imageCarouselWrapper}>
      <div className={styles.imageCarousel} ref={ref as React.LegacyRef<HTMLDivElement> | undefined} {...events}>
        {posts.map((post) => (
          <div key={post.id} className={styles.imageCardWrapper}>
            <ImageCard key={post.id} onClick={onClickItem} id={post.id} post={post}>
              <ImageOverlay
                id={post.id}
                description={post.description}
                title={post.title}
                commentCount={post.comments.commentCount}
                fontVariation="small"
              />
            </ImageCard>
          </div>
        ))}
      </div>
    </div>
  );
};
