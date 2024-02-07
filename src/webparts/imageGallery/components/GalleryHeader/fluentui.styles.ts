import { IButtonStyles, ITextStyles } from "@fluentui/react";

export const controlPanelButtonStyles: IButtonStyles = {
  root: {
    marginRight: ".5em",
  },
};

export const photoBtnStyles: IButtonStyles = {
  root: {
    minWidth: 40,
  },
};

export const usernameStyles: ITextStyles = {
  root: { marginRight: "auto", "@media screen and (max-width: 1280px)": { display: "none" } },
};

export const mobileUsernameStyles: ITextStyles = {
  root: {
    alignSelf: "end",
    position: "relative",
    top: 20,
    "@media screen and (min-width: 1280px)": { display: "none" },
  },
};
