import { IImageServerObj } from "./IImageServerObj";

export class Image {
    id: number;
    title: string;
    description: string;
    imagePath: string;
    disableComments: boolean;

    constructor(image: IImageServerObj) {
        this.id = image.ID;
        this.title = image.Title;
        this.disableComments = image.DisableComments;
        this.imagePath = image.File.ServerRelativeUrl;
        this.description = image.ImageDescription;
    }
}