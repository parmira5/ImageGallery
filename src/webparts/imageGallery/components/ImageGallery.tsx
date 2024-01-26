import * as React from "react";
import styles from "./ImageGallery.module.scss";
import ImageCard from "./ImageCard/ImageCard";
import { imageService } from "../../../services/imageService";
import { Image } from "../../../models/Image";
import { Comments } from "./Comments/Comments";

import { ActionButton, Panel, PanelType, Pivot, PivotItem } from "@fluentui/react";
import { panelStyles, pivotStyles } from "./fluentui.styles";
import { find } from "@microsoft/sp-lodash-subset";

const ImageGallery = (): JSX.Element => {
  const [images, setImages] = React.useState<Image[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<Image>();

  React.useEffect(() => {
    updateImageGallery().catch(console.error);
  }, []);

  return (
    <div className={styles.imageGallery}>
      <section>
        <ActionButton iconProps={{ iconName: "Photo" }} text="Submit a Photo" />
        <Pivot styles={pivotStyles}>
          <PivotItem headerText="Fun and Games" />
          <PivotItem headerText="Corporate Events" />
          <PivotItem headerText="Holiday Party" />
        </Pivot>
      </section>
      <section className={styles.imageGridWrapper}>
        {images.map((img) => (
          <ImageCard
            key={img.id}
            onClick={handleClickImage}
            id={img.id}
            src={img.imagePath}
            description={img.description}
            title={img.title}
            commentCount={img.comments.commentCount}
            fetchImageCommentCount={fetchImageComments}
          />
        ))}
      </section>
      <Panel
        styles={panelStyles}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        type={PanelType.custom}
        customWidth="100%"
      >
        <section className={styles.fullSizeContainer}>
          <img className={styles.fullSizeImage} src={selectedImage?.imagePath} alt="todo" />
          <div style={{ backgroundColor: "white", width: "500px", height: "100%" }}>
            {selectedImage?.id && <Comments image={selectedImage} />}
          </div>
        </section>
      </Panel>
    </div>
  );

  function handleClickImage(imageId: number): void {
    setSelectedImage(images.filter((img) => img.id === imageId)[0]);
    setIsOpen(true);
  }

  async function updateImageGallery(): Promise<void> {
    const images = await imageService.getImages();
    setImages(images);
  }

  async function fetchImageComments(imageId: number): Promise<void> {
    const _comments = await imageService.getCommentCount(imageId);
    const _images = [...images];
    const img = find(_images, (img) => img.id === imageId);
    if (img) img.comments = _comments;
    setImages(_images);
  }
};

export default ImageGallery;
