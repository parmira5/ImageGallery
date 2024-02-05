import * as React from "react";
import Config from "../models/Config";
import { configService } from "../services/configService";

export const useConfig = () => {
  const [config, setConfig] = React.useState<Config>(new Config());

  React.useEffect(() => {
    configService.getConfig().then(setConfig);
  }, []);

  async function updateConfig(config: Config): Promise<void> {
    await configService.updateConfig(config);
    setConfig(config);
  }

  return [config, updateConfig] as const;
};
