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
import { ALL } from "./strings";

const ImageGallery = (): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [selectedCategory, setSelectedCategory] = React.useState<string>(ALL);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = React.useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = React.useState(false);
  const [config, setConfig] = React.useState<IConfigServerObj>();

  React.useEffect(() => {
    (async () => {
      const _config = await configService.getConfig();
      setConfig(_config)
      const _posts = await imageService.getAllPosts(_config.DisableAllComments);
      setPosts(_posts);
      userService.currentUserHasFullControlOnImageList().then(setIsAdmin).catch(console.error);
    })();
  }, []);


  return (
    <div className={styles.appWrapper}>
      <GalleryHeader
        onClickFilterButton={handleClickFilterButton}
        showAdminControls={isAdmin}
        selectedCategory={selectedCategory}
        onSettingsButtonClick={toggleAdminPanel}
        onPivotClick={handlePivotClick}
        onSubmitPhotoButtonClick={() => {
          window.location.href = "https://r3v365.sharepoint.com/sites/NEWSSITE2/_layouts/15/upload.aspx?List=%7B004FE25A-52A8-46AD-8623-D39472E55A66%7D&RootFolder=%2Fsites%2FNEWSSITE2%2FImage%20Gallery&ContentTypeId=0x01010200908E517D0A2D0B40B5F9566F4030C6DC00F207EA97E9128F48B8EE3D7585B53555&Source=https://r3v365.sharepoint.com/sites/NEWSSITE2"
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
    if (selectedCategory.props.itemKey) setSelectedCategory(selectedCategory.props.itemKey);
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

  async function handleClickFilterButton(selectedKey: string): Promise<void> {
    let _posts: Post[]
    if (selectedKey) setSelectedCategory(selectedKey);
    switch (selectedKey) {
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
