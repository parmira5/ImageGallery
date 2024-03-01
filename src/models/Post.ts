import { IPostServerObj } from "./IPostServerObj";
import { ImageHelper } from "@microsoft/sp-image-helper";
import { IListUser } from "./IListUser";
import { CommentObj } from "./CommentObj";

const MAX_IMG_WIDTH = 800;
const MAX_THUMBNAIL_WIDTH = 400;

export class Post {
  id: number | undefined;
  description: string;
  serverRelativeUrl: string;
  imageThumbnailPath: string;
  imagePath: string;
  disableComments: boolean;
  authorEmail: string;
  authorName: string;
  createdDate: string;
  comments: { items: CommentObj[]; commentCount: number };
  imageWidth: number;
  imageHeight: number;
  taggedUsers: Partial<IListUser>[] | string[];
  imageCategory: string;

  constructor(image?: IPostServerObj) {
    this.id = image?.ID || undefined;
    this.disableComments = image?.DisableComments || false;
    this.serverRelativeUrl = image?.File.ServerRelativeUrl || "";
    this.imagePath = image
      ? ImageHelper.convertToImageUrl({ sourceUrl: image.File.ServerRelativeUrl, width: MAX_IMG_WIDTH })
      : "";
    this.imageThumbnailPath = image
      ? ImageHelper.convertToImageUrl({
          sourceUrl: image.File.ServerRelativeUrl,
          width: MAX_THUMBNAIL_WIDTH,
        })
      : "";
    this.description = image?.ImageDescription || "";
    this.authorName = image?.Author.Title || "";
    this.authorEmail = image?.Author.EMail || "";
    this.createdDate = image?.Created || "";
    this.comments = { items: [], commentCount: 0 };
    this.imageWidth = image?.ImageWidth || 0;
    this.imageHeight = image?.ImageHeight || 0;
    this.taggedUsers = image?.TaggedUsers || [];
    this.imageCategory = image?.ImageCategory || "";
  }
}
