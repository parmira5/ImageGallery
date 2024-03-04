import { IPersonaStyles, ITextFieldStyles, ITextStylesReturnType } from "@fluentui/react";

export const textFieldStyles: Partial<ITextFieldStyles> = {
  root: { width: "100%" },
};

export const personStyles: Partial<IPersonaStyles> = {
  root: { marginRight: 5 },
};

export function textStyles(color?: string): ITextStylesReturnType {
  return { root: { flexGrow: 1, color: color || "[theme:neutralLighter, default:#f4f4f4]" } };
}
