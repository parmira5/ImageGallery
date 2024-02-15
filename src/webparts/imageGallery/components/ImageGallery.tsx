import * as React from "react";

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

import { Filters } from "./Filters/Filters";
interface IProps {
  displayMode: DisplayMode;
  onChangeCarouselHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
}

const ImageGallery = ({ onChangeCarouselHeader, displayMode }: IProps): JSX.Element => {
  const { pageSize, filters, carouselHeader, appType, baseQuery, defaultFilter } = React.useContext(ConfigContext);

  const [posts, setPosts] = React.useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [filterQuery, setFilterQuery] = React.useState(defaultFilter?.itemProp || undefined);
  const [isAdminVisible, { toggle: toggleAdminVisible }] = useBoolean(false);
  const [isImageViewerVisible, { toggle: toggleImageViewerVisible }] = useBoolean(false);
  const [isGridLoading, { setTrue: gridLoading, setFalse: gridDoneLoading }] = useBoolean(false);

  const [config, updateConfig] = useConfig();
  const isCarousel = appType === AppType.Carousel;

  const configOptions: IImageServiceOptions = React.useMemo(
    () => ({
      baseQuery: baseQuery,
      filter: filterQuery,
      disableComments: config.DisableAllComments,
      pageSize,
    }),
    [config.DisableAllComments, pageSize, filterQuery, baseQuery]
  );

  React.useEffect(() => {
    (async () => {
      gridLoading();
      const _posts = await imageService.getAllPosts(configOptions);
      setPosts(_posts);
      gridDoneLoading();
    })();
  }, [configOptions]);

  return (
    <>
      <BasicHeader
        displayMode={displayMode}
        headerText={carouselHeader}
        onChangeHeader={onChangeCarouselHeader}
        filterElement={
          <Filters
            defaultSelectedKey={defaultFilter?.itemKey || ""}
            filterItems={filters}
            setSelectedFilter={setFilterQuery}
          />
        }
        showFilters={filters.length > 0}
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
