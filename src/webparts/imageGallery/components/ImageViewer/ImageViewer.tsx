import { IPanelProps, Panel, PanelType } from "@fluentui/react";
import * as React from "react";
import { Post } from "../../../../models/Post";
import { Comments } from "./Comments/Comments";
import { panelStyles } from "../fluentui.styles";
import styles from "./ImageViewer.module.scss";
import { ImageDescription } from "./ImageDescription";
import { ConfigContext } from "../../../../context/ConfigContext";

interface IProps extends Pick<IPanelProps, "onDismiss" | "isOpen"> {
  selectedPost: Post;
}

export const ImageViewer = ({ selectedPost, ...props }: React.PropsWithChildren<IProps>): JSX.Element => {
  const postWrapperRef = React.useRef<HTMLElement>(null);
  const { commentsDisabled } = React.useContext(ConfigContext);
  if (!selectedPost) return <></>;
  return (
    <Panel {...props} styles={panelStyles} type={PanelType.custom} customWidth="100%" allowTouchBodyScroll>
      <section ref={postWrapperRef} className={styles.postWrapper}>
        <div style={{ position: "relative" }}>
          {commentsDisabled && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            >
              <ImageDescription
                authorEmail={selectedPost.authorEmail}
                authorName={selectedPost.authorName}
                createdDate={selectedPost.createdDate}
                description={selectedPost.description}
                taggedUsers={selectedPost.taggedUsers}
                fontColor="white"
              />
            </div>
          )}
          <img
            className={styles.fullSizeImage}
            src={selectedPost.imagePath}
            alt="todo" //TODO
            width={selectedPost.imageWidth}
            height={selectedPost.imageHeight}
          />
        </div>
        {!commentsDisabled && (
          <div className={styles.commentsWrapper}>
            <ImageDescription
              authorEmail={selectedPost.authorEmail}
              authorName={selectedPost.authorName}
              createdDate={selectedPost.createdDate}
              description={selectedPost.description}
              taggedUsers={selectedPost.taggedUsers}
              separator
            />
            <Comments ref={postWrapperRef} image={selectedPost} />
          </div>
        )}
      </section>
    </Panel>
  );
};
