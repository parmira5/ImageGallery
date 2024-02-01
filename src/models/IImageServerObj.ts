import { IFileInfo } from "@pnp/sp/files";
import { IAuthor } from "./IAuthor";

export interface IImageServerObj {
  ID: number;
  Title: string;
  ImageDescription: string;
  ImageCategory: string;
  DisableComments: boolean;
  ServerRelativePath: string;
  File: IFileInfo;
  Author: IAuthor;
  Created: string;
}
