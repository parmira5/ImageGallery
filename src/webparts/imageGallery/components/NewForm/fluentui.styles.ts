import { DefaultPalette, ICommandBarStyles, IStackStyles } from "@fluentui/react";

export const commandBarStyles: ICommandBarStyles = {
  root: { marginRight: 0, paddingRight: 0 },
  secondarySet: { display: "flex", alignItems: "flex-end" },
};

export const imageUploadWrapperStyles: IStackStyles = {
  root: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: DefaultPalette.neutralTertiary,
    height: "auto",
    padding: 10,
    overflow: "hidden",
    minHeight: 285,
  },
};
