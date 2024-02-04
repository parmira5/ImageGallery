import * as React from "react";
import styles from "./ImageGallery.module.scss";

import { Post } from "../../../models/Post";

import { imageService } from "../../../services/imageService";
import { userService } from "../../../services/userService";
import { configService } from "../../../services/configService";

import { AdminConfig } from "./AdminConfig/AdminConfig";
import { ImageViewer } from "./ImageViewer/ImageViewer";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { GalleryHeader } from "./GalleryHeader/GalleryHeader";
import { IConfigServerObj } from "../../../models/IConfigServerObj";
import { PivotItem } from "@fluentui/react";

const ImageGallery = (): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = React.useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);
  const [config, setConfig] = React.useState<IConfigServerObj>();

  React.useEffect(() => {
    (async () => {
      const _config = await configService.getConfig();
      const _posts = await imageService.getAllPosts(_config.DisableAllComments);
      setConfig(config)
      setPosts(_posts);
      userService.currentUserHasFullControlOnImageList().then(setIsAdmin).catch(console.error);
    })();
  }, []);

  isAdmin;

  return (
    <div className={styles.appWrapper}>
      <GalleryHeader
        onSettingsButtonClick={toggleAdminPanel}
        onPivotClick={handlePivotClick}
        onSubmitPhotoButtonClick={() => {
          console.log("submit");
        }}
      />
      <div className={styles.imageGallery}>
        <ImageGrid posts={posts} onClickItem={handleClickImage} onClickMore={handleLoadMore} hasNext={imageService.hasNext} />
        <ImageViewer
          isOpen={isImageViewerOpen}
          onDismiss={toggleImagePanel}
          selectedPost={selectedPost}
          hideComments={!!config?.DisableAllComments}
        />
        <AdminConfig isOpen={isAdminPanelOpen} onDismiss={toggleAdminPanel} />
      </div>
    </div>
  );

  async function handlePivotClick(selectedCategory: PivotItem): Promise<void> {
    let _posts: Post[]
    switch (selectedCategory.props.itemKey) {
      case "MINE":
        _posts = await imageService.getAllUsersPosts();
        break;
      case "TAGGED":
        _posts = await imageService.getAllUsersTaggedPosts();
        break;
      case "ALL":
      default:
        _posts = await imageService.getAllPosts();
        break;
    }
    setPosts(_posts);
  }


  function handleClickImage(post: Post): void {
    toggleImagePanel();
    setSelectedPost(post);
  }

  async function handleLoadMore(): Promise<void> {
    if (imageService.hasNext && imageService.getNext) {
      const nextSet = await imageService.getNext();
      if (nextSet) {
        setPosts((prev) => [...prev, ...nextSet]);
      }
    }
  }

  function toggleAdminPanel(): void {
    setIsAdminPanelOpen((prev) => !prev);
  }

  function toggleImagePanel(): void {
    setIsImageViewerOpen((prev) => !prev);
  }
};

export default ImageGallery;
