import * as React from "react";
import styles from "./ImageGalleryForm.module.scss";
import { FormCustomizerContext } from "@microsoft/sp-listview-extensibility";
import {
  PrimaryButton,
  Stack,
  TextField,
  DefaultButton,
  Dropdown,
  IDropdownOption,
  CommandBar,
  ICommandBarItemProps,
  Separator,
} from "@fluentui/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { listService } from "../../../services/listService";
import { commandBarStyles, imageUploadWrapperStyles } from "./fluentui.styles";
import { Post } from "../../../models/Post";
import { FormDisplayMode } from "@microsoft/sp-core-library";

// import styles from "./ImageGalleryForm.module.scss";

export interface IImageGalleryFormProps {
  context: FormCustomizerContext;
  onSave: (post: Post, fileContent: Blob) => void;
  onClose: () => void;
  item: Post;
  displayMode: FormDisplayMode;
}

const ImageGalleryForm = ({ context, onClose, onSave, item, displayMode }: IImageGalleryFormProps) => {
  const [post, setPost] = React.useState<Post>(item);
  const [image, setImage] = React.useState<ImageListType>([]);
  const [choiceOptions, setChoiceOptions] = React.useState<IDropdownOption[]>([]);

  const isReadMode = displayMode === FormDisplayMode.Display;
  let imagePath = post.imagePath || "";
  if (image[0] && image[0].dataURL) {
    imagePath = image[0].dataURL;
  }

  React.useEffect(() => {
    listService.getCategoryOptions().then(setChoiceOptions);
  }, []);

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "SAVE",
      text: "Save",
      className: styles.commandBarItems,
      onRender: (item) => <PrimaryButton {...item} disabled={!imagePath || isReadMode} />,
      onClick: handleSave,
    },
    {
      key: "CANCEL",
      text: "Cancel",
      onClick: onClose,
      iconProps: { iconName: "Cancel" },
      className: styles.commandBarItems,
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 5, maxWidth: 640, padding: "1em" }}>
      <Stack verticalAlign="baseline">
        <CommandBar items={[]} farItems={commandBarItems} styles={commandBarStyles} />
        <Separator />
      </Stack>
      <ImageUploading value={image} onChange={(value) => setImage(value)}>
        {({ imageList, onImageRemoveAll, onImageUpload }) => {
          const handleRemove = handleRemoveFactory(onImageRemoveAll);
          return (
            <Stack
              styles={imageUploadWrapperStyles}
              tokens={{ childrenGap: 10, maxWidth: 640 }}
              verticalAlign="space-between"
            >
              <img className={styles.image} src={imagePath} />
              <Stack horizontal tokens={{ childrenGap: 5 }} horizontalAlign="end">
                <PrimaryButton
                  text="Select Image"
                  onClick={onImageUpload}
                  iconProps={{ iconName: "Photo" }}
                  disabled={!imagePath || isReadMode}
                />
                <DefaultButton
                  text="Remove"
                  onClick={handleRemove}
                  iconProps={{ iconName: "Delete" }}
                  disabled={!image.length || isReadMode}
                />
              </Stack>
            </Stack>
          );
        }}
      </ImageUploading>
      <Dropdown
        label="Category"
        options={choiceOptions}
        onChange={handleCategoryChange}
        selectedKey={post.imageCategory || choiceOptions[0]?.key}
        disabled={isReadMode}
      />
      <TextField
        multiline
        label="Description"
        value={post.description}
        onChange={handleDescriptionChange}
        disabled={isReadMode}
      />
    </Stack>
  );

  function handleSave() {
    if (image[0].file) onSave(post, image[0].file);
  }

  function handleDescriptionChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) {
    setPost((prev) => ({ ...prev, description: newValue || "" }));
  }

  function handleCategoryChange(
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption<any> | undefined,
    index?: number | undefined
  ) {
    if (option?.key && typeof option.key === "string") {
      setPost((prev) => ({ ...prev, imageCategory: option.key as string }));
    }
  }

  function handleRemoveFactory(removalCb: () => void) {
    return () => {
      removalCb();
      setPost((prev) => ({ ...prev, imagePath: "" }));
    };
  }
};

export default ImageGalleryForm;
