import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/comments";

import { Image } from "../models/Image";
import { IImageServerObj } from "../models/IImageServerObj";
import { ICommentServerObj } from "../models/ICommentServerObj";
import { Comment } from "../models/Comment";

export interface IImageService {
  getImages(): Promise<Image[]>;
  getComments(imageId: number): Promise<Comment[]>;
}

export class ImageService {
  public static readonly serviceKey: ServiceKey<IImageService> =
    ServiceKey.create<IImageService>("SPFx:SampleService", ImageService);
  private _sp: SPFI;

  public init(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      const pageContext = serviceScope.consume(PageContext.serviceKey);
      this._sp = spfi().using(spSPFx({ pageContext }));
    });
  }

  public async getImages(): Promise<Image[]> {
    const selectFields: (
      | keyof IImageServerObj
      | "Author/EMail"
      | "Author/Title"
    )[] = [
      "Title",
      "ImageDescription",
      "ID",
      "ImageCategory",
      "DisableComments",
      "File",
      "Author/Title",
      "Author/EMail",
      "Created",
    ];
    const res = await this._sp.web.lists
      .getByTitle("Image Gallery")
      .items.select(selectFields.join(", "))
      .expand("File, Author")<IImageServerObj[]>();
    return res.map((res) => new Image(res));
  }

  public async getComments(imageId: number): Promise<Comment[]> {
    const selectFields: (keyof ICommentServerObj)[] = [
      "author",
      "createdDate",
      "id",
      "isLikedByUser",
      "likeCount",
      "replyCount",
      "text",
    ];
    const res = await this._sp.web.lists
      .getByTitle("Image Gallery")
      .items.getById(imageId)
      .comments.orderBy("id", true)
      .select(selectFields.join(", "))<ICommentServerObj[]>();
    return res.map((res) => new Comment(res));
  }

  public async postComment(imageId: number, text: string): Promise<void> {
    // const res = await this._sp.web.lists.getByTitle("Image Gallery").items.getById(imageId).comments.add({})
    // TODO
  }
}

export const imageService = new ImageService();
