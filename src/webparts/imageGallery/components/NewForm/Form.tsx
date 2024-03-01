import * as React from "react";
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
  IPanelProps,
  Panel,
  PanelType,
} from "@fluentui/react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { commandBarStyles, imageUploadWrapperStyles } from "./fluentui.styles";
import { Post } from "../../../../models/Post";
import { listService } from "../../../../services/listService";
import styles from "./NewForm.module.scss";
import { postService } from "../../../../services/postService";

interface IProps extends Pick<IPanelProps, "onDismiss" | "isOpen"> {}

const Form = (props: IProps) => {
  const [post, setPost] = React.useState<Post>(new Post());
  const [image, setImage] = React.useState<ImageListType>([]);
  const [choiceOptions, setChoiceOptions] = React.useState<IDropdownOption[]>([]);

  const imagePath = image[0]?.dataURL || "";

  React.useEffect(() => {
    listService.getCategoryOptions().then(setChoiceOptions);
  }, []);

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "SAVE",
      text: "Save",
      className: styles.commandBarItems,
      onRender: (item) => <PrimaryButton {...item} disabled={!imagePath} />,
      onClick: () => {
        handleSave();
      },
    },
    {
      key: "CANCEL",
      text: "Cancel",
      onClick: () => {
        if (props.onDismiss) props.onDismiss();
      },
      iconProps: { iconName: "Cancel" },
      className: styles.commandBarItems,
    },
  ];

  return (
    <Panel type={PanelType.medium} {...props}>
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
                <div className={styles.imageWrapper}>
                  {imagePath && <img className={styles.image} src={imagePath} />}
                </div>
                <Stack horizontal tokens={{ childrenGap: 5 }} horizontalAlign="end">
                  <PrimaryButton text="Select Image" onClick={onImageUpload} iconProps={{ iconName: "Photo" }} />
                  <DefaultButton text="Remove" onClick={handleRemove} iconProps={{ iconName: "Delete" }} />
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
        />
        <TextField multiline label="Description" value={post.description} onChange={handleDescriptionChange} />
      </Stack>
    </Panel>
  );

  async function handleSave() {
    if (image[0]?.file) {
      await postService.createPost(post, image[0].file);
      if (props.onDismiss) props.onDismiss();
    }
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

export default Form;
