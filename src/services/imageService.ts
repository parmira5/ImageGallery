import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/comments";
import "@pnp/sp/presets/all";

import { Image } from "../models/Image";
import { IImageServerObj } from "../models/IImageServerObj";
import { ICommentServerObj } from "../models/ICommentServerObj";
import { Comment } from "../models/Comment";
import { IComment, ICommentInfo } from "@pnp/sp/comments";

import { SPHttpClient } from "@microsoft/sp-http-base";
import { ICommentsServerObj } from "../models/ICommentsServerObj";
import { CommentsObj } from "../models/CommentsObj";

export interface IImageService {
  getImages(): Promise<Image[]>;
  getComments(imageId: number): Promise<Comment[]>;
}

export class ImageService {
  public static readonly serviceKey: ServiceKey<IImageService> = ServiceKey.create<IImageService>(
    "SPFx:SampleService",
    ImageService
  );
  private _sp: SPFI;
  private _spHttpClient: SPHttpClient;

  public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient): void {
    this._spHttpClient = spHttpClient;
    serviceScope.whenFinished(() => {
      const pageContext = serviceScope.consume(PageContext.serviceKey);
      this._sp = spfi().using(spSPFx({ pageContext }));
    });
  }

  public async getImages(): Promise<Image[]> {
    const selectFields: (keyof IImageServerObj | "Author/EMail" | "Author/Title")[] = [
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
      .select(selectFields.join(", "))();

    return res.map((res) => new Comment(res));
  }

  public async getCommentCount(imageId: number): Promise<CommentsObj> {
    const res = await this._spHttpClient.get(
      `https://r3v365.sharepoint.com/sites/NEWSSITE2/_api/web/lists/getByTitle('Image Gallery')/items('${imageId}')/comments?$inlineCount=AllPages&$top=1`,
      SPHttpClient.configurations.v1
    );
    const json = (await res.json()) as ICommentsServerObj;

    return new CommentsObj(json);
  }

  public async postComment(imageId: number, text: string): Promise<IComment & ICommentInfo> {
    return this._sp.web.lists.getByTitle("Image Gallery").items.getById(imageId).comments.add(text);
  }
}

export const imageService = new ImageService();
