import { IPanelStyles, IPivotStyles } from "@fluentui/react";

export const pivotStyles: Partial<IPivotStyles> = {
    root: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        borderBottom: "1px solid #EBEBEB"
    }
}

export const panelStyles: Partial<IPanelStyles> = {
    main: { backgroundColor: "rgba(0,0,0,0.85)" },
    commands: { backgroundColor: "rgba(0,0,0,0.55)" },
    subComponentStyles: { closeButton: { root: { color: "white" } } },
    scrollableContent: { height: "100%", ".ms-Panel-content": { height: "90%", display: "flex", justifyContent: "stretch", boxSizing: "border-box" } }
}