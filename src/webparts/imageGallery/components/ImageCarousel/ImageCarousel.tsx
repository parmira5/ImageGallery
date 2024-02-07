import * as React from "react";
import { Post } from "../../../../models/Post";
import ImageCard from "../ImageCard/ImageCard";
import { ImageOverlay } from "../ImageCard/ImageOverlay";
import styles from "./ImageCarousel.module.scss";
import { useDraggable } from "react-use-draggable-scroll";
import { ActionButton, Link, PrimaryButton, TextField } from "@fluentui/react";
import { DisplayMode } from "@microsoft/sp-core-library";

interface IProps {
  posts: Post[];
  onClickItem: (post: Post) => void;
  onClickSettings: () => void;
  onChangeHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
  headerText: string;
  displayMode: DisplayMode;
}

export const ImageCarousel = ({ posts, onClickItem, onChangeHeader, onClickSettings, headerText, displayMode }: IProps) => {
  const ref = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const { events } = useDraggable(ref, { applyRubberBandEffect: true });
  const showHeader = displayMode === DisplayMode.Edit || !!headerText;
  return (
    <div className={styles.imageCarouselWrapper}>
      <div className={styles.topRow}>
        {showHeader &&
          <TextField
            borderless
            styles={{ root: { paddingLeft: 0 }, field: { fontSize: 20, paddingLeft: 0 } }}
            placeholder="Enter a header"
            onChange={onChangeHeader}
            value={headerText}
          />
        }
        <Link style={{ marginLeft: "auto" }}>See all</Link>
      </div>
      <div className={styles.topRow}>
        <ActionButton
          styles={{ root: { paddingLeft: 0, marginBottom: 10 }, icon: { marginLeft: 0 } }}
          iconProps={{ iconName: "Add" }}
          text="Submit a Photo"
        />
        <PrimaryButton styles={{ root: { minWidth: 50 } }} iconProps={{ iconName: "Settings" }} onClick={onClickSettings} />
      </div>
      <div className={styles.imageCarousel} ref={ref as React.LegacyRef<HTMLDivElement> | undefined} {...events}>
        {posts.map((post) => (
          <div className={styles.imageCardWrapper}>
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
