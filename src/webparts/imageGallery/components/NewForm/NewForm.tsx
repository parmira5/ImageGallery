import { IPanelProps, Panel, PanelType } from "@fluentui/react";
import * as React from "react";
import Form from "./Form";

interface IProps extends Pick<IPanelProps, "onDismiss" | "isOpen"> {}

export const NewForm = (props: React.PropsWithChildren<IProps>): JSX.Element => {
  return (
    <Panel {...props} type={PanelType.medium}>
      <Form />
    </Panel>
  );
};
