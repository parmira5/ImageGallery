import * as React from "react";
import { ConfigContext } from "../../../../context/ConfigContext";
import styles from "./ImageGrid.module.scss";
import { shimmerStyles } from "./fluentui.styles";
import { Shimmer } from "@fluentui/react";
import { columnCountDict } from "./helpers";

export function ImageGridShimmer(): JSX.Element {
  const { columnCount, pageSize } = React.useContext(ConfigContext);

  return (
    <div className={`${styles.imageGridWrapper} ${styles.shimmerWrapper}`}>
      {Array(pageSize)
        .fill("")
        .map((_, i) => (
          <Shimmer
            key={i}
            styles={shimmerStyles}
            style={{ minWidth: columnCountDict[columnCount], maxWidth: columnCountDict[columnCount] }}
          />
        ))}
    </div>
  );
}
