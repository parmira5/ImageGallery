import * as React from "react";
import { ImageGrid, IProps as ImageGripProps } from "./ImageGrid/ImageGrid";
import { BasicHeader, IProps as IHeaderProps } from "./BasicHeader/BasicHeader";

interface IProps extends IHeaderProps, ImageGripProps {}

export const GridApp = ({
  displayMode,
  hasNext,
  headerText,
  isLoading,
  onChangeHeader,
  onClickItem,
  onClickMore,
  onClickSettings,
  posts,
}: IProps) => {
  return (
    <>
      <BasicHeader
        headerText={headerText}
        onChangeHeader={onChangeHeader}
        displayMode={displayMode}
        onClickSettings={onClickSettings}
      />
      <ImageGrid
        posts={posts}
        onClickItem={onClickItem}
        onClickMore={onClickMore}
        hasNext={hasNext}
        isLoading={isLoading}
      />
    </>
  );
};
