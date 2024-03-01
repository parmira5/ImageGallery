import { IFileInfo } from "@pnp/sp/files";
import { IListUser } from "./IListUser";

export interface IPostServerObj {
  ID: number;
  Title: string;
  ImageDescription: string;
  ImageCategory: string;
  DisableComments: boolean;
  ServerRelativePath: string;
  File: IFileInfo;
  Author: IListUser;
  Created: string;
  ImageWidth: number;
  ImageHeight: number;
  TaggedUsers: Partial<IListUser>[] | string[];
}
