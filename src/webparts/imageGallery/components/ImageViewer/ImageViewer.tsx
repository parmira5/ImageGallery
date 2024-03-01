import { IPanelProps, Panel, PanelType } from "@fluentui/react";
import * as React from "react";
import { Post } from "../../../../models/Post";
import { Comments } from "./Comments/Comments";
import { panelStyles } from "../fluentui.styles";
import styles from "./ImageViewer.module.scss";
import { ImageDescription } from "./ImageDescription";

interface IProps extends Pick<IPanelProps, "onDismiss" | "isOpen"> {
  selectedPost: Post;
  hideComments: boolean;
  hideTags: boolean;
}

export const ImageViewer = ({
  selectedPost,
  hideComments,
  hideTags,
  ...props
}: React.PropsWithChildren<IProps>): JSX.Element => {
  const postWrapperRef = React.useRef<HTMLElement>(null);
  if (!selectedPost) return <></>;
  return (
    <Panel {...props} styles={panelStyles} type={PanelType.custom} customWidth="100%" allowTouchBodyScroll>
      <section ref={postWrapperRef} className={styles.postWrapper}>
        <img
          className={styles.fullSizeImage}
          src={selectedPost.imagePath}
          alt="todo" //TODO
          width={selectedPost.imageWidth}
          height={selectedPost.imageHeight}
        />
        {!hideComments && (
          <div className={styles.commentsWrapper}>
            <ImageDescription
              authorEmail={selectedPost.authorEmail}
              authorName={selectedPost.authorName}
              createdDate={selectedPost.createdDate}
              description={selectedPost.description}
              taggedUsers={selectedPost.taggedUsers}
            />
            <Comments ref={postWrapperRef} image={selectedPost} hideTags={hideTags} />
          </div>
        )}
      </section>
    </Panel>
  );
};
