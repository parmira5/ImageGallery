import * as React from "react";
import { FormDisplayMode } from "@microsoft/sp-core-library";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import {
  PrimaryButton,
  Stack,
  TextField,
  DefaultButton,
  DefaultPalette,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { IPostServerObj } from "../../../models/IPostServerObj";
import { ListService } from "../../../services/listService";

// import styles from "./ImageGalleryForm.module.scss";

export interface IImageGalleryFormProps {
  context: FormCustomizerContext;
  displayMode: FormDisplayMode;
  onSave: () => void;
  onClose: () => void;
  listService: ListService;
}

// const LOG_SOURCE: string = "ImageGalleryForm";

const ImageGalleryForm = ({ context, listService }: IImageGalleryFormProps) => {
  const [post, setPost] = React.useState<Partial<IPostServerObj>>({});
  const [image, setImage] = React.useState<ImageListType>([]);
  const [choiceOptions, setChoiceOptions] = React.useState<IDropdownOption[]>([]);

  React.useEffect(() => {
    listService.getCategoryOptions(context.list.title).then(setChoiceOptions);
  }, []);

  return (
    <Stack tokens={{ childrenGap: 5, maxWidth: 640 }}>
      <ImageUploading value={image} onChange={(value) => setImage(value)}>
        {({ errors, imageList, isDragging, onImageRemoveAll, onImageUpdate, onImageUpload }) => {
          return (
            <Stack
              styles={{
                root: {
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: DefaultPalette.neutralTertiary,
                  height: "auto",
                  padding: 10,
                  overflow: "hidden",
                  minHeight: 285,
                },
              }}
              tokens={{ childrenGap: 10, maxWidth: 640, maxHeight: 300 }}
              verticalAlign="end"
            >
              <img
                style={{ height: "100%", maxHeight: "225px", objectFit: "contain" }}
                src={imageList[0]?.dataURL || ""}
              />
              <Stack horizontal tokens={{ childrenGap: 5 }} horizontalAlign="end">
                <PrimaryButton text="Select Image" onClick={onImageUpload} iconProps={{ iconName: "Photo" }} />
                <DefaultButton
                  text="Remove"
                  onClick={onImageRemoveAll}
                  iconProps={{ iconName: "Delete" }}
                  disabled={!image.length}
                />
              </Stack>
            </Stack>
          );
        }}
      </ImageUploading>
      <Dropdown label="Category" options={choiceOptions} />
      <TextField
        multiline
        label="Description"
        value={post.ImageDescription}
        onChange={(e, n) => setPost((prev) => ({ ...prev, ImageDescription: n }))}
      />
    </Stack>
  );
};

export default ImageGalleryForm;
