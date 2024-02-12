import * as React from "react";
// import { PivotItem } from "@fluentui/react";

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

import { IFilter } from "../../../propertyPane/PropertyPaneImagePicker/Filter";
import { PivotItem } from "@fluentui/react";
import { BasicHeader } from "./BasicHeader/BasicHeader";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { ImageCarousel } from "./ImageCarousel/ImageCarousel";

interface IProps {
  displayMode: DisplayMode;
  onChangeCarouselHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
}

function filterBuilder(filters: IFilter[]): string {
  return filters.map((filter) => {
    if (filter.operator === "startsWith" || filter.operator === "contains") {
      return `${filter.operator}(${filter.filterProperty}, '${filter.filterValue}')`
    }
    return `${filter.filterProperty} ${filter.operator} '${filter.filterValue}'`
  }).join(" AND ");
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
  const { pageSize, filters } = React.useContext(ConfigContext);

  console.log(isAdmin);
  console.log(selectedCategory);
  console.log(filters);
  console.log(filterBuilder(filters));

  const verticals = filters.filter(filter => filter.filterType === "Vertical").map(filter => <PivotItem key={filter.verticalName} headerText={filter.verticalName} />)
  const isCarousel = appType === AppType.Carousel;

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

  return (
    <>
      <BasicHeader
        displayMode={displayMode}
        headerText={carouselHeader}
        onChangeHeader={onChangeCarouselHeader}
        verticals={verticals}
      />
      {!isCarousel && <>
        <ImageGrid
          posts={posts}
          onClickItem={handleClickImage}
          onClickMore={handleLoadMore}
          hasNext={imageService.hasNext}
          isLoading={isGridLoading}
        />
      </>}
      {isCarousel && <>
        <ImageCarousel onClickItem={handleClickImage} posts={posts} />
      </>}
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

  // async function handlePivotClick(selectedCategory: PivotItem): Promise<void> {
  //   if (selectedCategory.props.itemKey) {
  //     gridLoading();
  //     await handleVerticalChange(selectedCategory.props.itemKey);
  //     gridDoneLoading();
  //   }
  // }

  // async function handleClickFilterButton(selectedKey: string): Promise<void> {
  //   gridLoading();
  //   await handleVerticalChange(selectedKey);
  //   gridDoneLoading();
  // }

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

  // async function handleVerticalChange(vert: string) {
  //   let _posts: Post[];
  //   if (vert) setSelectedCategory(vert);
  //   switch (vert) {
  //     case "MINE":
  //       _posts = await imageService.getAllUsersPosts(configOptions);
  //       break;
  //     case "TAGGED":
  //       _posts = await imageService.getAllUsersTaggedPosts(configOptions);
  //       break;
  //     case "ALL":
  //     default:
  //       _posts = await imageService.getAllPosts(configOptions);
  //       break;
  //   }
  //   setPosts(_posts);
  // }
};

export default ImageGallery;
