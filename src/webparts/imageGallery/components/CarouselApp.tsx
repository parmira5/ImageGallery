import * as React from "react";
import { BasicHeader, IProps as IHeaderProps } from "./BasicHeader/BasicHeader";
import { ImageCarousel, IProps as ICarouselProps } from "./ImageCarousel/ImageCarousel";

interface IProps extends IHeaderProps, ICarouselProps {}

export const CarouselApp = ({
  displayMode,
  headerText,
  onChangeHeader,
  onClickSettings,
  onClickItem,
  posts,
}: IProps) => {
  return (
    <div>
      <BasicHeader
        displayMode={displayMode}
        headerText={headerText}
        onChangeHeader={onChangeHeader}
        onClickSettings={onClickSettings}
      />
      <ImageCarousel onClickItem={onClickItem} posts={posts} />
    </div>
  );
};
