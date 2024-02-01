import { IButtonStyles, IPanelStyles, IPivotStyles } from "@fluentui/react";

export const pivotStyles: Partial<IPivotStyles> = {
  root: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderBottom: "1px solid #EBEBEB",
  },
};

export const panelStyles: Partial<IPanelStyles> = {
  main: { backgroundColor: "rgba(0,0,0,0.85)" },
  commands: { backgroundColor: "rgba(0,0,0,0.55)" },
  subComponentStyles: { closeButton: { root: { color: "white" } } },
  scrollableContent: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    ".ms-Panel-content": {
      height: "calc(100vh - 50px)",
      boxSizing: "border-box",
      flexGrow: 1,
      "@media (max-width: 1280px)": {
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
};

export const pageBtnStyles: Partial<IButtonStyles> = { root: { alignSelf: "center" } };
