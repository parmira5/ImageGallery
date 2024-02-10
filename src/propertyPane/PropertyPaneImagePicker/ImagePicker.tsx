import * as React from "react";
import styles from "./ImagePicker.module.scss";

import { Panel, PanelType, PrimaryButton, Icon, DefaultButton } from "office-ui-fabric-react";
import { ImageHelper } from "@microsoft/sp-image-helper";

import InfiniteScroll from "react-infinite-scroll-component";
import { v4 as uuidv4 } from "uuid";

export interface IImagePickerProps {
  selectedImage: string;
  buttonLabel: string;
  hasPagination?: boolean;
  hasNext?: () => boolean;
  loadImages: () => Promise<string[]>;
  nextPage?: () => Promise<string[]>;
  onSave: (imgUrl: string) => void;
}

/**
 * Image Picker Control
 * @param selectedImage Path to currently selected image
 * @param buttonLabel Show picker control button text
 * @param hasPagination
 * @param hasNext CB that returns a boolean indicating whether there is another page of images
 * @param loadImages CB that fetches inital set of images
 * @param nextPage CB that fetches the next page of images
 * @param onSave CB that is called when the Save button is clicked
 * @returns JSX.Element
 */

export default function ImagePicker({
  buttonLabel,
  selectedImage,
  hasNext,
  onSave,
  loadImages,
  nextPage,
}: IImagePickerProps): JSX.Element {
  const hasMore = hasNext();
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [images, setImages] = React.useState([]);
  const infiniteScrollId = uuidv4();

  let _selectedImage = selectedImage;

  const onRenderFooterContent = () => (
    <div>
      <PrimaryButton onClick={handleClickSave} styles={{ root: { marginRight: 8 } }}>
        Save
      </PrimaryButton>
      <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
    </div>
  );

  React.useEffect(() => {
    loadImages()
      .then((result) => setImages(result))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className={styles.container}>
      <img src={selectedImage} className={styles.imageContainer}></img>
      <PrimaryButton text={buttonLabel} onClick={() => setIsPanelOpen(true)} />
      <Panel
        isOpen={isPanelOpen}
        onDismiss={dismissPanel}
        isLightDismiss
        type={PanelType.large}
        headerText="Select an image"
        onRenderFooterContent={onRenderFooterContent}
        isFooterAtBottom={true}
        layerProps={{ eventBubblingEnabled: true }}
        styles={{
          scrollableContent: { overflowY: "hidden" },
          content: { paddingRight: "0", height: "100%", overflow: "hidden" },
        }}
      >
        <div id={infiniteScrollId} style={{ height: "100%", overflowY: "scroll" }}>
          <InfiniteScroll
            dataLength={images.length}
            next={getNext}
            hasMore={hasMore}
            loader={<div>Loading...</div>}
            className={styles.imageGallery}
            scrollableTarget={infiniteScrollId}
          >
            {images.map((image, index) => (
              <span
                className={styles.imageItem}
                onClick={() => {
                  _selectedImage = image;
                }}
              >
                <img
                  src={ImageHelper.convertToImageUrl({ sourceUrl: image, width: 200, height: 200 })}
                />
                <input id={String(index)} name="imageSel" type="radio"></input>
                <label htmlFor={index.toString()}></label>
                <Icon iconName="SkypeCircleCheck"></Icon>
              </span>
            ))}
          </InfiniteScroll>
        </div>
      </Panel>
    </div>
  );

  function dismissPanel(): void {
    setIsPanelOpen(false);
  }

  function handleClickSave(): void {
    onSave(_selectedImage);
    dismissPanel();
  }

  async function getNext(): Promise<void> {
    const nextImages = await nextPage();
    if (nextImages) {
      setImages((prev) => [...prev, ...nextImages]);
    }
  }
}
