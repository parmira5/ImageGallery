import * as React from "react";
// import { PivotItem } from "@fluentui/react";

import { Post } from "../../../models/Post";

import { IImageServiceOptions, imageService } from "../../../services/imageService";

import { useConfig } from "../../../hooks/useConfig";
import { useBoolean } from "@fluentui/react-hooks";

import { AdminConfig } from "./AdminConfig/AdminConfig";
import { ImageViewer } from "./ImageViewer/ImageViewer";
import { DisplayMode } from "@microsoft/sp-core-library";
import { ConfigContext } from "../../../context/ConfigContext";
import { AppType } from "../../../models/AppType";

import { BasicHeader } from "./BasicHeader/BasicHeader";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { ImageCarousel } from "./ImageCarousel/ImageCarousel";
import { IFilter } from "../../../models/IFilter";
import { userService } from "../../../services/userService";
import { TDynamicValue } from "../../../models/TDynamicValues";
import { startOfDay } from "date-fns";
import { Filters } from "./Filters/Filters";
interface IProps {
  displayMode: DisplayMode;
  onChangeCarouselHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
}

function resolveDynamicValue(valueName: TDynamicValue): string {
  switch (valueName) {
    case "USER_EMAIL":
      return userService.currentUser().email;
    case "TODAY":
      return startOfDay(new Date()).toISOString();
    default:
      return "";
  }
}

function buildQuery(filter: IFilter) {
  if (filter.isNoFilter) return "";
  let value = filter.filterValue;
  if (filter.valueType === "Dynamic" && typeof value === "string") {
    value = resolveDynamicValue(value as TDynamicValue);
  }
  if (filter.operator === "startsWith" || filter.operator === "contains") {
    return `${filter.operator}(${filter.filterProperty}, '${value}')`;
  }
  return `${filter.filterProperty} ${filter.operator} '${value}'`;
}

const ImageGallery = ({ onChangeCarouselHeader, displayMode }: IProps): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [selectedFilter, setSelectedFilter] = React.useState<string>();
  const [isAdminVisible, { toggle: toggleAdminVisible }] = useBoolean(false);
  const [isImageViewerVisible, { toggle: toggleImageViewerVisible }] = useBoolean(false);
  const [isGridLoading, { setTrue: gridLoading, setFalse: gridDoneLoading }] = useBoolean(false);

  const { pageSize, filters, carouselHeader, appType } = React.useContext(ConfigContext);
  const [config, updateConfig] = useConfig();
  const isCarousel = appType === AppType.Carousel;

  const filterItems = filters
    .filter((filter) => filter.filterType === "Vertical")
    .map((filter) => ({
      key: filter.verticalName,
      itemKey: filter.verticalName,
      text: filter.verticalName,
      headerText: filter.verticalName,
      itemProp: buildQuery(filter),
      isDefault: filter.isDefault,
    }));
  const baseQuery = filters
    .filter((filter) => filter.filterType === "All")
    .map((filter) => buildQuery(filter))
    .join(" and ");

  const configOptions: IImageServiceOptions = React.useMemo(
    () => ({
      baseQuery: baseQuery,
      filter: selectedFilter ?? filterItems.find((filter) => filter.isDefault)?.itemProp ?? "",
      disableComments: config.DisableAllComments,
      pageSize,
    }),
    [config.DisableAllComments, pageSize, selectedFilter, baseQuery]
  );

  React.useEffect(() => {
    (async () => {
      gridLoading();
      const _posts = await imageService.getAllPosts(configOptions);
      setPosts(_posts);
      gridDoneLoading();
    })();
  }, [configOptions, pageSize]);

  return (
    <>
      <BasicHeader
        displayMode={displayMode}
        headerText={carouselHeader}
        onChangeHeader={onChangeCarouselHeader}
        filterElement={
          <Filters
            defaultSelectedKey={filterItems.find((f) => f.isDefault)?.key || filterItems[0]?.key || ""}
            filterItems={filterItems}
            setSelectedFilter={setSelectedFilter}
          />
        }
        showFilters={filterItems.length > 0}
      />
      {!isCarousel && (
        <ImageGrid
          posts={posts}
          onClickItem={handleClickImage}
          onClickMore={handleLoadMore}
          hasNext={imageService.hasNext}
          isLoading={isGridLoading}
        />
      )}
      {isCarousel && <ImageCarousel onClickItem={handleClickImage} posts={posts} />}
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
};

export default ImageGallery;
