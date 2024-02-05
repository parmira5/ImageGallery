import { IPanelProps, Panel, PanelType, Toggle } from "@fluentui/react";
import * as React from "react";
import Config from "../../../../models/Config";

interface IProps extends Pick<IPanelProps, "onDismiss" | "isOpen"> {
  config: Config;
  updateConfig: (config: Config) => Promise<void>;
}

export const AdminConfig = ({ config, updateConfig, ...props }: IProps): JSX.Element => {
  return (
    <Panel {...props} type={PanelType.medium}>
      <h2>Config</h2>
      <Toggle checked={config.DisableAllComments} label="Disable Comments?" onChange={handleCommentsToggle} />
      <Toggle checked={config.DisableTagging} label="Disable Tagging?" onChange={handleTaggingToggle} />
    </Panel>
  );

  function handleCommentsToggle(event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) {
    updateConfig({ ...config, DisableAllComments: !!checked }).catch();
  }

  function handleTaggingToggle(event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean) {
    updateConfig({ ...config, DisableTagging: !!checked }).catch();
  }
};
