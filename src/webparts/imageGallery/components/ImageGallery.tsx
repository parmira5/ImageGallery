import * as React from 'react';
import styles from './ImageGallery.module.scss';
import ImageCard from './ImageCard/ImageCard';
import { imageService } from '../../../services/imageService';
import { Image } from '../../../models/Image';
import { ActionButton, Panel, PanelType, Pivot, PivotItem } from '@fluentui/react';
import { panelStyles, pivotStyles } from './fluentui.styles';
// import { useBoolean } from '@fluentui/react-hooks';

const ImageGallery = () => {
  const [images, setImages] = React.useState<Image[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<Image>()

  React.useEffect(() => {
    imageService.getImages()
      .then((res) => setImages(res))
      .catch(console.error)
  }, [])

  return (
    <section className={styles.imageGallery}>
      <section>
        <ActionButton iconProps={{ iconName: "Photo" }} text='Submit a Photo' />
        <Pivot styles={pivotStyles}>
          <PivotItem headerText='Fun and Games' />
          <PivotItem headerText='Corporate Events' />
          <PivotItem headerText='Holiday Party' />
        </Pivot>
      </section>
      <section className={styles.imageGridWrapper}>
        {images.map(img => <ImageCard onClick={handleClickImage} id={img.id} src={img.imagePath} description={img.description} title={img.title} />)}
      </section>
      <Panel
        styles={panelStyles}
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        type={PanelType.custom}
        customWidth='100%'
      >
        <section className={styles.fullSizeContainer}>
          <img className={styles.fullSizeImage} src={selectedImage?.imagePath} alt="todo" />
          <div style={{ backgroundColor: "white", width: "500px", height: "100%" }}></div>
        </section>
      </Panel>
    </section>
  );

  function handleClickImage(imageId: number) {
    setSelectedImage(images.filter(img => img.id === imageId)[0]);
    setIsOpen(true);
  }
}

export default ImageGallery;
