import * as React from "react";
import styles from "./Setup.module.scss";

import { Spinner, Stack, Text } from "@fluentui/react";

export const Setup = () => {
  return (
    <div className={styles.setup}>
      <Stack tokens={{ childrenGap: 10 }} horizontalAlign="center" verticalAlign="center">
        <Text variant="xLargePlus">Please wait while we set things up...</Text>
        <Spinner />
      </Stack>
    </div>
  );
};
