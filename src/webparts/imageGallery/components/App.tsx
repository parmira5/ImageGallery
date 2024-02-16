import * as React from "react";

import { Post } from "../../../models/Post";

import { IImageServiceOptions } from "../../../services/imageService";

import { useBoolean } from "@fluentui/react-hooks";

import { ImageViewer } from "./ImageViewer/ImageViewer";
import { DisplayMode } from "@microsoft/sp-core-library";
import { ConfigContext } from "../../../context/ConfigContext";
import { AppType } from "../../../models/AppType";

import { BasicHeader } from "./BasicHeader/BasicHeader";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { ImageCarousel } from "./ImageCarousel/ImageCarousel";

import { usePosts } from "../../../hooks/usePosts";

interface IProps {
  displayMode: DisplayMode;
  onChangeCarouselHeader: (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => void;
}

const App = ({ onChangeCarouselHeader, displayMode }: IProps): JSX.Element => {
  const { pageSize, filters, carouselHeader, appType, baseQuery, defaultFilter, commentsDisabled, taggingDisabled } =
    React.useContext(ConfigContext);

  const [selectedPost, setSelectedPost] = React.useState<Post>(new Post());
  const [filterQuery, setFilterQuery] = React.useState(defaultFilter?.itemProp || undefined);
  const [isImageViewerVisible, { toggle: toggleImageViewerVisible }] = useBoolean(false);

  const configOptions: IImageServiceOptions = React.useMemo(
    () => ({
      filter: filterQuery,
      disableComments: commentsDisabled,
      baseQuery,
      pageSize,
    }),
    [commentsDisabled, pageSize, filterQuery, baseQuery]
  );

  const { getNextPage, hasNext, isLoading, posts, isNextLoading, error } = usePosts(configOptions);

  console.log(error);

  const isCarousel = appType === AppType.Carousel;

  return (
    <>
      <BasicHeader
        displayMode={displayMode}
        headerText={carouselHeader}
        onChangeHeader={onChangeCarouselHeader}
        showFilters={filters.length > 0}
        setFilterQuery={setFilterQuery}
      />
      {!isCarousel && (
        <ImageGrid
          posts={posts}
          onClickItem={handleClickImage}
          onClickMore={handleLoadMore}
          hasNext={hasNext}
          isLoading={isLoading}
          isNextPageLoading={isNextLoading}
        />
      )}
      {isCarousel && <ImageCarousel onClickItem={handleClickImage} posts={posts} />}
      <ImageViewer
        isOpen={isImageViewerVisible}
        onDismiss={toggleImageViewerVisible}
        selectedPost={selectedPost}
        hideComments={commentsDisabled}
        hideTags={taggingDisabled}
      />
    </>
  );

  function handleClickImage(post: Post): void {
    toggleImageViewerVisible();
    setSelectedPost(post);
  }

  async function handleLoadMore(): Promise<void> {
    if (hasNext) {
      getNextPage();
    }
  }
};

export default App;
