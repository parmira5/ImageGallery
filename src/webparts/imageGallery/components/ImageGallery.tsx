import * as React from "react";
import styles from "./ImageGallery.module.scss";
import ImageCard from "./ImageCard/ImageCard";
import { imageService } from "../../../services/imageService";
import { Post } from "../../../models/Post";
import { Comments } from "./Comments/Comments";

import { ActionButton, Panel, PanelType, Pivot, PivotItem } from "@fluentui/react";
import { panelStyles, pivotStyles } from "./fluentui.styles";

const ImageGallery = (): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedPost, setSelectedPost] = React.useState<Post>();

  React.useEffect(() => {
    if (!isOpen) {
      getPosts().catch(console.error)
    }
  }, []);

  return (
    <div className={styles.imageGallery}>
      <section>
        <ActionButton iconProps={{ iconName: "Photo" }} text="Submit a Photo" />
        <Pivot styles={pivotStyles}>
          <PivotItem headerText="Fun and Games" />
          <PivotItem headerText="Corporate Events" />
          <PivotItem headerText="Holiday Party" />
        </Pivot>
      </section>
      <section className={styles.imageGridWrapper}>
        {posts.map((post) => (
          <ImageCard
            key={post.id}
            onClick={handleClickImage}
            id={post.id}
            post={post}
          />
        ))}
      </section>
      <Panel
        styles={panelStyles}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        type={PanelType.custom}
        customWidth="100%"
      >
        <section className={styles.fullSizeContainer}>
          <img className={styles.fullSizeImage} src={selectedPost?.imagePath} alt="todo" />
          <div style={{ backgroundColor: "white", width: "500px", height: "100%" }}>
            {selectedPost?.id && <Comments image={selectedPost} />}
          </div>
        </section>
      </Panel>
    </div>
  );

  async function getPosts(): Promise<void> {
    imageService.getImages().then(res => setPosts(res)).catch(console.error)
  }

  function handleClickImage(post: Post): void {
    setSelectedPost(post)
  }
};

export default ImageGallery;
