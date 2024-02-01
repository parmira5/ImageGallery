import { IPanelProps, Panel, PanelType, Toggle } from "@fluentui/react";
import * as React from "react";

interface IProps extends Pick<IPanelProps, "onDismiss" | "isOpen"> {}

export const AdminConfig = (props: IProps): JSX.Element => {
  return (
    <Panel {...props} type={PanelType.medium}>
      <h2>Config</h2>
      <Toggle label="Disable Comments?" />
    </Panel>
  );
};
