import { IConfigServerObj } from "./IConfigServerObj";

export default class Config implements IConfigServerObj {
  DisableAllComments: boolean;
  DisableTagging: boolean;
  ID: number;

  constructor(config?: IConfigServerObj) {
    this.DisableAllComments = config?.DisableAllComments || true;
    this.DisableTagging = config?.DisableTagging || true;
    this.ID = config?.ID || 0;
  }
}
