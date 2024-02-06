import * as React from "react";
import { PivotItem } from "@fluentui/react";
import styles from "./ImageGallery.module.scss";

import { ALL } from "./strings";
import { Post } from "../../../models/Post";

import { imageService } from "../../../services/imageService";
import { userService } from "../../../services/userService";

import { useConfig } from "../../../hooks/useConfig";
import { useBoolean } from "@fluentui/react-hooks";

import { AdminConfig } from "./AdminConfig/AdminConfig";
import { ImageViewer } from "./ImageViewer/ImageViewer";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { GalleryHeader } from "./GalleryHeader/GalleryHeader";
import { ImageCarousel } from "./ImageCarousel/ImageCarousel";
import { DisplayMode } from "@microsoft/sp-core-library";

interface IProps {
  displayMode: DisplayMode;
  layout: string;
  carouselHeader: string;
  onChangeCarouselHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
}

const ImageGallery = ({ layout, carouselHeader, onChangeCarouselHeader, displayMode }: IProps): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [selectedCategory, setSelectedCategory] = React.useState<string>(ALL);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isAdminVisible, { toggle: toggleAdminVisible }] = useBoolean(false);
  const [isImageViewerVisible, { toggle: toggleImageViewerVisible }] = useBoolean(false);
  const [isGridLoading, { setTrue: gridLoading, setFalse: gridDoneLoading }] = useBoolean(false);

  const [config, updateConfig] = useConfig();

  React.useEffect(() => {
    (async () => {
      gridLoading();
      const _posts = await imageService.getAllPosts(config.DisableAllComments);
      setPosts(_posts);
      gridDoneLoading();
      userService.currentUserHasFullControlOnImageList().then(setIsAdmin).catch(console.error);
    })();
  }, [config]);

  if (layout === "carousel")
    return (
      <>
        <ImageCarousel
          posts={posts}
          onClickItem={handleClickImage}
          headerText={carouselHeader}
          onChangeHeader={onChangeCarouselHeader}
          displayMode={displayMode}
        />
        <ImageViewer
          isOpen={isImageViewerVisible}
          onDismiss={toggleImageViewerVisible}
          selectedPost={selectedPost}
          hideComments={!!config?.DisableAllComments}
        />
        <AdminConfig
          isOpen={isAdminVisible}
          onDismiss={toggleAdminVisible}
          config={config}
          updateConfig={updateConfig}
        />
      </>
    );

  return (
    <div className={styles.appWrapper}>
      <GalleryHeader
        config={config}
        onClickFilterButton={handleClickFilterButton}
        showAdminControls={isAdmin}
        selectedCategory={selectedCategory}
        onSettingsButtonClick={toggleAdminVisible}
        onPivotClick={handlePivotClick}
        onSubmitPhotoButtonClick={() => {
          window.location.href =
            "https://r3v365.sharepoint.com/sites/NEWSSITE2/_layouts/15/upload.aspx?List=%7B004FE25A-52A8-46AD-8623-D39472E55A66%7D&RootFolder=%2Fsites%2FNEWSSITE2%2FImage%20Gallery&ContentTypeId=0x01010200908E517D0A2D0B40B5F9566F4030C6DC00F207EA97E9128F48B8EE3D7585B53555&Source=https://r3v365.sharepoint.com/sites/NEWSSITE2";
        }}
      />
      <div className={styles.imageGallery}>
        <ImageGrid
          posts={posts}
          onClickItem={handleClickImage}
          onClickMore={handleLoadMore}
          hasNext={imageService.hasNext}
          isLoading={isGridLoading}
        />
      </div>
      <ImageViewer
        isOpen={isImageViewerVisible}
        onDismiss={toggleImageViewerVisible}
        selectedPost={selectedPost}
        hideComments={!!config?.DisableAllComments}
      />
      <AdminConfig isOpen={isAdminVisible} onDismiss={toggleAdminVisible} config={config} updateConfig={updateConfig} />
    </div>
  );

  async function handlePivotClick(selectedCategory: PivotItem): Promise<void> {
    if (selectedCategory.props.itemKey) {
      gridLoading();
      await handleVerticalChange(selectedCategory.props.itemKey);
      gridDoneLoading();
    }
  }

  async function handleClickFilterButton(selectedKey: string): Promise<void> {
    gridLoading();
    await handleVerticalChange(selectedKey);
    gridDoneLoading();
  }

  function handleClickImage(post: Post): void {
    toggleImageViewerVisible();
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

  async function handleVerticalChange(vert: string) {
    let _posts: Post[];
    if (vert) setSelectedCategory(vert);
    switch (vert) {
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
};

export default ImageGallery;
