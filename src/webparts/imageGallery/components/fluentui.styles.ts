import { IPanelStyles } from "@fluentui/react";

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
