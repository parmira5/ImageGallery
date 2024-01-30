import * as React from "react";
import styles from "./ImageGallery.module.scss";
import ImageCard from "./ImageCard/ImageCard";
import { imageService } from "../../../services/imageService";
import { Post } from "../../../models/Post";
import { Comments } from "./Comments/Comments";

import {
  ActionButton,
  Panel,
  PanelType,
  Pivot,
  PivotItem,
} from "@fluentui/react";
import { panelStyles, pivotStyles } from "./fluentui.styles";

const ImageGallery = (): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>();
  const [categories, setCategories] = React.useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      getPosts(selectedCategory).catch(console.error);
    }
  }, [isOpen, selectedCategory]);

  React.useEffect(() => {
    imageService.getCategories().then(setCategories).catch(console.error)
  }, [])

  return (
    <div className={styles.imageGallery}>
      <section>
        <ActionButton iconProps={{ iconName: "Photo" }} text="Submit a Photo" />
        <Pivot selectedKey={selectedCategory} styles={pivotStyles} onLinkClick={handleCategoryClick} headersOnly overflowBehavior="menu">
          <PivotItem itemKey="All" headerText="All" />
          {categories.map(cat => <PivotItem key={cat} itemKey={cat} headerText={cat} />)}
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
        <section className={styles.postWrapper}>
          <img
            className={styles.fullSizeImage}
            src={selectedPost?.imagePath}
            alt="todo"
            width={selectedPost?.imageWidth}
            height={selectedPost?.imageHeight}
          />
          <div className={styles.commentsWrapper}>
            {selectedPost?.id && <Comments image={selectedPost} />}
          </div>
        </section>
      </Panel>
    </div>
  );

  async function getPosts(selectedCategory: string): Promise<void> {
    if (selectedCategory === "All") {
      imageService
        .getImages()
        .then((res) => setPosts(res))
        .catch(console.error);
    } else {
      imageService
        .getImages(selectedCategory)
        .then((res) => setPosts(res))
        .catch(console.error);
    }
  }

  function handleClickImage(post: Post): void {
    setIsOpen(true);
    setSelectedPost(post);
  }

  function handleCategoryClick(item?: PivotItem): void {
    if (item && item.props.itemKey) {
      setSelectedCategory(item.props.itemKey)
    } else {
      setSelectedCategory("All")
    }
  }
};

export default ImageGallery;
