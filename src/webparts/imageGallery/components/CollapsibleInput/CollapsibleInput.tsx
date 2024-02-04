import { DefaultButton, IButtonProps, PrimaryButton, TextField } from "@fluentui/react";
import * as React from "react";
import styles from "./CollapsibleInput.module.scss";

interface IProps {
  isOpen: boolean;
  placeHolder?: string;
  expandButtonText: string;
  value: string;
  onChangeInput: (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue: string) => void;
  onClickExpand: () => void;
  onSave: () => void;
  onCancel: () => void;
  saveButtonProps?: IButtonProps;
  cancelButtonProps?: IButtonProps;
  expandButtonProps?: IButtonProps;
}

export const CollapsibleInput = ({
  expandButtonText,
  isOpen,
  onClickExpand,
  onCancel,
  onSave,
  onChangeInput,
  value,
  cancelButtonProps,
  expandButtonProps,
  saveButtonProps,
  placeHolder,
}: IProps) => {
  if (!isOpen) {
    return (
      <React.Fragment>
        <DefaultButton {...expandButtonProps} text={expandButtonText} onClick={onClickExpand} />
      </React.Fragment>
    );
  }

  return (
    <div className={styles.collapsibleInput}>
      <TextField placeholder={placeHolder} multiline value={value} onChange={onChangeInput} />
      <div className={styles.buttonWrapper}>
        <DefaultButton {...cancelButtonProps} text="Cancel" onClick={onCancel} />
        <PrimaryButton {...saveButtonProps} text="Send" onClick={onSave} />
      </div>
    </div>
  );
};
