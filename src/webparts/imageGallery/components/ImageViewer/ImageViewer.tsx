import { IPanelProps, Panel, PanelType } from "@fluentui/react";
import * as React from "react";
import { Post } from "../../../../models/Post";
import { Comments } from "../Comments/Comments";
import { panelStyles } from "../fluentui.styles";
import styles from "./ImageViewer.module.scss";

interface IProps extends Pick<IPanelProps, "onDismiss" | "isOpen"> {
  selectedPost: Post;
  hideComments: boolean;
}

export const ImageViewer = ({ selectedPost, hideComments, ...props }: React.PropsWithChildren<IProps>): JSX.Element => {
  const postWrapperRef = React.useRef<HTMLElement>(null);
  return (
    <Panel {...props} styles={panelStyles} type={PanelType.custom} customWidth="100%" allowTouchBodyScroll>
      <section ref={postWrapperRef} className={styles.postWrapper}>
        <img
          className={styles.fullSizeImage}
          src={selectedPost?.imagePath}
          alt="todo"
          width={selectedPost?.imageWidth}
          height={selectedPost?.imageHeight}
        />
        {!hideComments && (
          <div className={styles.commentsWrapper}>
            <Comments ref={postWrapperRef} image={selectedPost} />
          </div>
        )}
      </section>
    </Panel>
  );
};
