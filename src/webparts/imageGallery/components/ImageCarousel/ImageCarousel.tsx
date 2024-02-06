import * as React from "react";
import { Post } from "../../../../models/Post";
import ImageCard from "../ImageCard/ImageCard";
import { ImageOverlay } from "../ImageCard/ImageOverlay";
import styles from "./ImageCarousel.module.scss";
import { useDraggable } from "react-use-draggable-scroll";
import { ActionButton, TextField } from "@fluentui/react";
import { DisplayMode } from "@microsoft/sp-core-library";

interface IProps {
  posts: Post[];
  onClickItem: (post: Post) => void;
  onChangeHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
  headerText: string;
  displayMode: DisplayMode;
}

export const ImageCarousel = ({ posts, onClickItem, onChangeHeader, headerText, displayMode }: IProps) => {
  const ref = React.useRef<HTMLDivElement>(null) as React.MutableRefObject<HTMLDivElement>;
  const { events } = useDraggable(ref);
  const showHeader = displayMode === DisplayMode.Edit || !!headerText;
  return (
    <div>
      {showHeader && (
        <TextField
          borderless
          styles={{ root: { paddingLeft: 0 }, field: { fontSize: 20, paddingLeft: 0 } }}
          placeholder="Enter a header"
          onChange={onChangeHeader}
          value={headerText}
        />
      )}
      <ActionButton
        styles={{ root: { paddingLeft: 0, marginBottom: 10 }, icon: { marginLeft: 0 } }}
        iconProps={{ iconName: "Add" }}
        text="Submit a Photo"
      />
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
