import { IPersonaStyles, ITextFieldStyles, ITextStyles } from "@fluentui/react";

export const textFieldStyles: Partial<ITextFieldStyles> = {
  root: { width: "100%" },
  field: { fontSize: 16 }
};

export const personStyles: Partial<IPersonaStyles> = {
  root: { marginRight: 5 },
};

export const commentTextStyles: Partial<ITextStyles> = {
  root: { flexGrow: 1 },
};

export const dateTextStyles: Partial<ITextStyles> = {
  root: { color: "[theme:neutralLighter, default:#f4f4f4]" },
};
