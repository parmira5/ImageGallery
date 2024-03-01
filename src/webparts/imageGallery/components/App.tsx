import * as React from "react";

import { Post } from "../../../models/Post";

import { IPostServiceOptions } from "../../../services/postService";

import { useBoolean } from "@fluentui/react-hooks";

import { ImageViewer } from "./ImageViewer/ImageViewer";
import { DisplayMode } from "@microsoft/sp-core-library";
import { ConfigContext } from "../../../context/ConfigContext";
import { AppType } from "../../../models/AppType";

import { BasicHeader } from "./BasicHeader/BasicHeader";
import { ImageGrid } from "./ImageGrid/ImageGrid";
import { ImageCarousel } from "./ImageCarousel/ImageCarousel";

import { usePosts } from "../../../hooks/usePosts";
import Form from "./NewForm/Form";

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
  const [filterQuery, setFilterQuery] = React.useState(defaultFilter?.itemProp);
  const [isImageViewerVisible, { toggle: toggleImageViewerVisible }] = useBoolean(false);
  const [isNewFormVisible, { toggle: toggleNewFormVisible }] = useBoolean(false);

  const configOptions: IPostServiceOptions = React.useMemo(
    () => ({
      filter: filterQuery,
      disableComments: commentsDisabled,
      baseQuery,
      pageSize,
    }),
    [commentsDisabled, pageSize, filterQuery, baseQuery]
  );

  const { getNextPage, hasNext, isLoading, posts, isNextLoading } = usePosts(configOptions);

  const isCarousel = appType === AppType.Carousel;

  return (
    <>
      <BasicHeader
        displayMode={displayMode}
        headerText={carouselHeader}
        onChangeHeader={onChangeCarouselHeader}
        showFilters={filters.length > 0}
        setFilterQuery={setFilterQuery}
        onClickSubmitPhoto={toggleNewFormVisible}
      />
      {isCarousel && <ImageCarousel onClickItem={handleClickImage} posts={posts} />}
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
      <ImageViewer
        isOpen={isImageViewerVisible}
        onDismiss={toggleImageViewerVisible}
        selectedPost={selectedPost}
        hideComments={commentsDisabled}
        hideTags={taggingDisabled}
      />
      <Form isOpen={isNewFormVisible} onDismiss={toggleNewFormVisible} />
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
