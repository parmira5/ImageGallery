import { IFileInfo } from "@pnp/sp/files";
import { IAuthorObj } from "./IAuthorObj";

export interface IPostServerObj {
  ID: number;
  Title: string;
  ImageDescription: string;
  ImageCategory: string;
  DisableComments: boolean;
  ServerRelativePath: string;
  File: IFileInfo;
  Author: IAuthorObj;
  Created: string;
}
