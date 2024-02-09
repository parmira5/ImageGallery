import * as React from "react";
import { PivotItem } from "@fluentui/react";

import { ALL } from "./strings";
import { Post } from "../../../models/Post";

import { IImageServiceOptions, imageService } from "../../../services/imageService";
import { userService } from "../../../services/userService";

import { useConfig } from "../../../hooks/useConfig";
import { useBoolean } from "@fluentui/react-hooks";

import { AdminConfig } from "./AdminConfig/AdminConfig";
import { ImageViewer } from "./ImageViewer/ImageViewer";
import { DisplayMode } from "@microsoft/sp-core-library";
import { ConfigContext } from "../../../context/ConfigContext";
import { AppType } from "../../../models/AppType";
import { FullPageApp } from "./FullPageApp";
import { CarouselApp } from "./CarouselApp";
import { GridApp } from "./GridApp";

interface IProps {
  displayMode: DisplayMode;
  onChangeCarouselHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
}

const ImageGallery = ({ onChangeCarouselHeader, displayMode }: IProps): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [selectedCategory, setSelectedCategory] = React.useState<string>(ALL);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isAdminVisible, { toggle: toggleAdminVisible }] = useBoolean(false);
  const [isImageViewerVisible, { toggle: toggleImageViewerVisible }] = useBoolean(false);
  const [isGridLoading, { setTrue: gridLoading, setFalse: gridDoneLoading }] = useBoolean(false);

  const { carouselHeader, appType } = React.useContext(ConfigContext);

  const [config, updateConfig] = useConfig();
  const { pageSize } = React.useContext(ConfigContext);

  console.log(isAdmin);
  const configOptions: IImageServiceOptions = { disableComments: config.DisableAllComments, pageSize };

  React.useEffect(() => {
    (async () => {
      setSelectedCategory(ALL);
      gridLoading();
      const _posts = await imageService.getAllPosts(configOptions);
      setPosts(_posts);
      gridDoneLoading();
      userService.currentUserHasFullControlOnImageList().then(setIsAdmin).catch(console.error);
    })();
  }, [config, pageSize]);

  let app: JSX.Element;
  console.log(appType);
  switch (appType) {
    case AppType.Grid:
      app = (
        <GridApp
          displayMode={displayMode}
          hasNext={imageService.hasNext}
          headerText={carouselHeader}
          isLoading={isGridLoading}
          onChangeHeader={onChangeCarouselHeader}
          onClickItem={handleClickImage}
          onClickMore={handleLoadMore}
          onClickSettings={toggleAdminVisible}
          posts={posts}
        />
      );
      break;
    case AppType.Carousel:
      app = (
        <CarouselApp
          displayMode={displayMode}
          headerText={carouselHeader}
          onChangeHeader={onChangeCarouselHeader}
          onClickItem={handleClickImage}
          onClickSettings={toggleAdminVisible}
          posts={posts}
        />
      );
      break;
    case AppType.FullPageApp:
    default:
      app = (
        <FullPageApp
          config={config}
          hasNext={imageService.hasNext}
          isLoading={isGridLoading}
          onClickFilterButton={handleClickFilterButton}
          onClickItem={handleClickImage}
          onClickMore={handleLoadMore}
          onSettingsButtonClick={toggleAdminVisible}
          onSubmitPhotoButtonClick={() => console.log("")}
          posts={posts}
          selectedCategory={selectedCategory}
          showAdminControls={isAdminVisible}
          toggleAdminPanelVisible={toggleAdminVisible}
          onPivotClick={handlePivotClick}
        />
      );
      break;
  }

  return (
    <>
      {app}
      <ImageViewer
        isOpen={isImageViewerVisible}
        onDismiss={toggleImageViewerVisible}
        selectedPost={selectedPost}
        hideComments={!!config?.DisableAllComments}
        hideTags={!!config?.DisableTagging}
      />
      <AdminConfig isOpen={isAdminVisible} onDismiss={toggleAdminVisible} config={config} updateConfig={updateConfig} />
    </>
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
      const nextSet = await imageService.getNext(configOptions);
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
        _posts = await imageService.getAllUsersPosts(configOptions);
        break;
      case "TAGGED":
        _posts = await imageService.getAllUsersTaggedPosts(configOptions);
        break;
      case "ALL":
      default:
        _posts = await imageService.getAllPosts(configOptions);
        break;
    }
    setPosts(_posts);
  }
};

export default ImageGallery;
