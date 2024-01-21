import { IFileInfo } from "@pnp/sp/files";

export interface IImageServerObj {
    ID: number;
    Title: string;
    ImageDescription: string;
    ImageCategory: string;
    DisableComments: boolean;
    ServerRelativePath: string;
    File: IFileInfo;
}