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

import { ActionButton, Pivot, PivotItem } from "@fluentui/react";
import { BasicHeader } from "./BasicHeader/BasicHeader";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { ImageCarousel } from "./ImageCarousel/ImageCarousel";
import { IFilter } from "../../../models/IFilter";

interface IProps {
  displayMode: DisplayMode;
  onChangeCarouselHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
}

function buildQuery(filter: IFilter) {
  if (filter.isNoFilter) return "";
  if (filter.operator === "startsWith" || filter.operator === "contains") {
    return `${filter.operator}(${filter.filterProperty}, '${filter.filterValue}')`;
  }
  return `${filter.filterProperty} ${filter.operator} '${filter.filterValue}'`;
}

const ImageGallery = ({ onChangeCarouselHeader, displayMode }: IProps): JSX.Element => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [selectedFilter, setSelectedFilter] = React.useState<string>("");
  const [isAdminVisible, { toggle: toggleAdminVisible }] = useBoolean(false);
  const [isImageViewerVisible, { toggle: toggleImageViewerVisible }] = useBoolean(false);
  const [isGridLoading, { setTrue: gridLoading, setFalse: gridDoneLoading }] = useBoolean(false);

  const { carouselHeader, appType } = React.useContext(ConfigContext);

  const { pageSize, filters } = React.useContext(ConfigContext);
  const [config, updateConfig] = useConfig();
  const isCarousel = appType === AppType.Carousel;

  const filterItems = filters
    .filter((filter) => filter.filterType === "Vertical")
    .map((filter) => ({
      key: filter.verticalName,
      text: filter.verticalName,
      headerText: filter.verticalName,
      itemProp: buildQuery(filter),
    }));
  const baseQuery = filters
    .filter((filter) => filter.filterType === "All")
    .map((filter) => buildQuery(filter))
    .join(" and ");

  const configOptions: IImageServiceOptions = React.useMemo(
    () => ({
      baseQuery: baseQuery,
      filter: selectedFilter,
      disableComments: config.DisableAllComments,
      pageSize,
    }),
    [config.DisableAllComments, pageSize, selectedFilter]
  );

  React.useEffect(() => {
    (async () => {
      gridLoading();
      const _posts = await imageService.getAllPosts(configOptions);
      setPosts(_posts);
      gridDoneLoading();
    })();
  }, [configOptions, pageSize]);

  const filtersComponent = (
    <>
      <ActionButton
        iconProps={{ iconName: "filter" }}
        menuProps={{
          items: filterItems,
          onItemClick(ev, item) {
            setSelectedFilter(item?.itemProp);
          },
        }}
      />
      <Pivot onLinkClick={(item) => setSelectedFilter(item?.props.itemProp || "")}>
        {filterItems.map((key) => (
          <PivotItem {...key} />
        ))}
      </Pivot>
    </>
  );

  return (
    <>
      <BasicHeader
        displayMode={displayMode}
        headerText={carouselHeader}
        onChangeHeader={onChangeCarouselHeader}
        filterElement={filtersComponent}
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
