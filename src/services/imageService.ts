import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { Guid } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { spfi, SPFI, SPFx as spSPFx } from "@pnp/sp";
import { InjectHeaders } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/comments";
import "@pnp/sp/batching";
import "@pnp/sp/fields";

import { IPostServerObj } from "../models/IPostServerObj";
import { IComment, ICommentInfo } from "@pnp/sp/comments";

import { SPHttpClient } from "@microsoft/sp-http-base";
import { ICommentsServerObj } from "../models/ICommentsServerObj";
import { CommentsRepository } from "../models/CommentsRepository";
import { PostsRepository } from "../models/PostsRepository";

export interface IImageService {
  getImages(): Promise<PostsRepository>;
  getComments(imageId: number, nextPage?: string): Promise<CommentsRepository>;
  postComment(imageId: number, text: string): Promise<IComment & ICommentInfo>;
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

  public async getImages(category?: string): Promise<PostsRepository> {
    const categoryFilter = category ? `ImageCategory eq '${category}'` : "";
    const selectFields: (keyof IPostServerObj | "Author/EMail" | "Author/Title")[] = [
      "Title",
      "ImageDescription",
      "ID",
      "ImageCategory",
      "DisableComments",
      "File",
      "Author/Title",
      "Author/EMail",
      "Created",
      "ImageWidth",
      "ImageHeight",
    ];
    const res = await this._sp.web.lists
      .using(InjectHeaders({ Accept: "application/json;odata=minimalmetadata" }))
      .getByTitle("Image Gallery")
      .items.select(selectFields.join(", "))
      .filter(categoryFilter)
      .top(9)
      .expand("File, Author")
      .orderBy("Created", false)
      .getPaged<IPostServerObj[]>();

    return new PostsRepository(res);
  }

  public async getComments(imageId: number, nextPage?: string): Promise<CommentsRepository> {
    const uri =
      nextPage ||
      `https://r3v365.sharepoint.com/sites/NEWSSITE2/_api/web/lists/getByTitle('Image Gallery')/items('${imageId}')/comments?$inlineCount=AllPages&$top=15`;
    const res = await this._spHttpClient.get(uri, SPHttpClient.configurations.v1);
    const json = (await res.json()) as ICommentsServerObj;
    return new CommentsRepository(json);
  }

  public async postComment(imageId: number, text: string): Promise<IComment & ICommentInfo> {
    return this._sp.web.lists.getByTitle("Image Gallery").items.getById(imageId).comments.add(text);
  }

  public async batchGetCommentCount(postIds: number[]): Promise<ICommentsServerObj[]> {
    const batchId = Guid.newGuid().toString();
    const batchIdentifierTemplate = `--batch_${batchId}\nContent-type: application/http\nContent-Transfer-Encoding: binary`;
    const requestTemplate = `GET https://r3v365.sharepoint.com/sites/NEWSSITE2/_api/web/lists/getByTitle('<<LIST>>')/items(<<ID>>)/comments?$inlineCount=AllPages&%24top=1 HTTP/1.1\naccept: application/json`;
    let requestBody = "";
    postIds.forEach((postId) => {
      requestBody += `${batchIdentifierTemplate}\n\n${requestTemplate
        .replace("<<LIST>>", "Image%20Gallery")
        .replace("<<ID>>", postId.toString())}\n\n\n\n`;
    });
    requestBody = `${requestBody}\n\n--batch_${batchId}--`;
    const res = await this._spHttpClient.post(
      "https://r3v365.sharepoint.com/sites/NEWSSITE2/_api/$batch",
      SPHttpClient.configurations.v1,
      {
        headers: {
          "Content-Type": `multipart/mixed; boundary=batch_${batchId}`,
        },
        body: requestBody,
      }
    );
    const resp = await res.text();
    const parsed = resp
      .split("\n")
      .filter((item) => {
        try {
          JSON.parse(item);
          return true;
        } catch (error) {
          return false;
        }
      })
      .map((item) => JSON.parse(item)) as ICommentsServerObj[];
    return parsed;
  }

  public async getCategories(): Promise<string[]> {
    const fields = await this._sp.web.lists
      .getByTitle("Image Gallery")
      .fields.getByTitle("ImageCategory")
      .select("Choices")();
    if (fields.Choices) return fields.Choices;
    return [];
  }
}

export const imageService = new ImageService();
