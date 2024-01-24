import { IPersonaStyles, ITextFieldStyles, ITextStyles } from "@fluentui/react";
import { makeStyles, shorthands, tokens } from "@fluentui/react-components";

export const useStyles = makeStyles({
  comments: {
    display: "flex",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    ...shorthands.padding("15px"),
  },

  inputWrapper: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    ...shorthands.gap(tokens.spacingHorizontalS),
  },

  input: {
    width: "100%",
  },

  commentList: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    flexGrow: 1,
    overflowY: "auto",
    ...shorthands.gap(tokens.spacingVerticalL),
  },

  comment: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  },

  commentBody: {
    display: "flex",
    flexDirection: "column",
  },
});

export const textFieldStyles: Partial<ITextFieldStyles> = {
  root: { width: "100%" },
};

export const personStyles: Partial<IPersonaStyles> = {
  root: { marginRight: 5 },
};

export const commentTextStyles: Partial<ITextStyles> = {
  root: { flexGrow: 1 },
};
