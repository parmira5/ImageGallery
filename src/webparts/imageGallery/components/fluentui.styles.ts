import { IPanelStyles, IPivotStyles } from "@fluentui/react";

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
        overflowY: "hidden",
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
  },
};

export const pivotStyles: Partial<IPivotStyles> = {
  root: {
    position: "relative",
    left: "-8px",
    width: "100%",
    maxWidth: 980,
    margin: "auto",
    marginBottom: "1.5em",
    "@media screen and (max-width: 1280px)": { paddingLeft: "14px" },
    "@media screen and (max-width: 480px)": { display: "flex", width: "100%", justifyContent: "center" },
  },
};
