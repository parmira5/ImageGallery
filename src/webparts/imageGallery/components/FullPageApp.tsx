import * as React from "react";
import styles from "./ImageGallery.module.scss";
import { GalleryHeader, IProps as IGalleryHeaderProps } from "./GalleryHeader/GalleryHeader";
import { ImageGrid, IProps as IImageGridProps } from "./ImageGrid/ImageGrid";
import { Pivot, PivotItem } from "@fluentui/react";
import { pivotStyles } from "./fluentui.styles";
import { ALL } from "./strings";

interface IProps extends IGalleryHeaderProps, IImageGridProps {
  onPivotClick?: (item?: PivotItem | undefined, ev?: React.MouseEvent<HTMLElement, MouseEvent> | undefined) => void;
  toggleAdminPanelVisible: () => void;
}

export const FullPageApp = ({
  onClickFilterButton,
  selectedCategory,
  toggleAdminPanelVisible,
  config,
  posts,
  hasNext,
  isLoading,
  onClickItem,
  onClickMore,
  onPivotClick,
}: IProps) => {
  return (
    <div className={styles.spaAppWrapper}>
      <GalleryHeader
        config={config}
        onClickFilterButton={onClickFilterButton}
        showAdminControls={true}
        selectedCategory={selectedCategory}
        onSettingsButtonClick={toggleAdminPanelVisible}
        onSubmitPhotoButtonClick={() => {
          window.location.href =
            "https://r3v365.sharepoint.com/sites/NEWSSITE2/_layouts/15/upload.aspx?List=%7B004FE25A-52A8-46AD-8623-D39472E55A66%7D&RootFolder=%2Fsites%2FNEWSSITE2%2FImage%20Gallery&ContentTypeId=0x01010200908E517D0A2D0B40B5F9566F4030C6DC00F207EA97E9128F48B8EE3D7585B53555&Source=https://r3v365.sharepoint.com/sites/NEWSSITE2";
        }}
      />
      <Pivot styles={pivotStyles} overflowBehavior="menu" onLinkClick={onPivotClick} selectedKey={selectedCategory}>
        <PivotItem key={ALL} itemKey={ALL} headerText={"All"} />
        <PivotItem key={"MINE"} itemKey={"MINE"} headerText={"Mine"} />
        {!config.DisableTagging ? <PivotItem key={"TAGGED"} itemKey={"TAGGED"} headerText={"Tagged"} /> : <></>}
      </Pivot>
      <ImageGrid
        posts={posts}
        onClickItem={onClickItem}
        onClickMore={onClickMore}
        hasNext={hasNext}
        isLoading={isLoading}
      />
    </div>
  );
};
