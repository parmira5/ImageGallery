import { CommentsObj } from "./CommentsObj";
import { IImageServerObj } from "./IImageServerObj";

export class Image {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  disableComments: boolean;
  authorEmail: string;
  authorName: string;
  createdDate: string;
  comments: CommentsObj;

  constructor(image: IImageServerObj) {
    this.id = image.ID;
    this.title = image.Title;
    this.disableComments = image.DisableComments;
    this.imagePath = image.File.ServerRelativeUrl;
    this.description = image.ImageDescription;
    this.authorName = image.Author.Title;
    this.authorEmail = image.Author.EMail;
    this.createdDate = image.Created;
    this.comments = {
      comments: [],
      commentCount: 0,
      nextPage: "",
    };
  }
}
