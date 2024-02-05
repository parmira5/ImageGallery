import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/comments";
import "@pnp/sp/batching";
import "@pnp/sp/fields";

import { IPostServerObj } from "../models/IPostServerObj";
import { CommentsRepository } from "../models/CommentsRepository";

import { SPHttpClient } from "@microsoft/sp-http-base";
import { IItems, PagedItemCollection } from "@pnp/sp/items";
import { userService } from "./userService";
import { Post } from "../models/Post";
import { commentService } from "./commenService";
import { findIndex } from "@microsoft/sp-lodash-subset";

export interface IImageService {
  getAllPosts(): Promise<Post[]>;
  getAllUsersPosts(): Promise<Post[]>;
  getAllUsersTaggedPosts(): Promise<Post[]>;
  getNext(): Promise<Post[]>;
  hasNext: boolean;
}

const selectFields: (
  | keyof IPostServerObj
  | "Author/EMail"
  | "Author/Title"
  | "TaggedUsers/EMail"
  | "TaggedUsers/FirstName"
  | "TaggedUsers/LastName"
)[] = [
  "Title",
  "ImageDescription",
  "ID",
  "ImageCategory",
  "DisableComments",
  "File",
  "Author/Title",
  "Author/EMail",
  "TaggedUsers/EMail",
  "TaggedUsers/FirstName",
  "TaggedUsers/LastName",
  "Created",
  "ImageWidth",
  "ImageHeight",
];

export class ImageService {
  public static readonly serviceKey: ServiceKey<IImageService> = ServiceKey.create<IImageService>(
    "SPFx:SampleService",
    ImageService
  );
  private _pageContext: PageContext;
  private _baseQuery: IItems;
  private _next: () => Promise<PagedItemCollection<IPostServerObj[]> | null>;
  public hasNext: boolean;

  public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient): void {
    serviceScope.whenFinished(() => {
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      const sp = spfi().using(SPFx({ pageContext: this._pageContext }));
      this._baseQuery = sp.web.lists
        .getByTitle("Image Gallery")
        .items.select(selectFields.join(","))
        .expand("File, Author, TaggedUsers")
        .top(9)
        .orderBy("Created", false);
    });
  }

  public async getAllPosts(disableComments = false): Promise<Post[]> {
    const res = await this._baseQuery.filter("").getPaged<IPostServerObj[]>();
    this._next = res.getNext.bind(res);
    this.hasNext = res.hasNext;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  public async getAllUsersPosts(disableComments = false): Promise<Post[]> {
    const res = await this._baseQuery
      .filter(`Author/EMail eq '${userService.currentUser().email}'`)
      .getPaged<IPostServerObj[]>();
    this._next = res.getNext.bind(res);
    this.hasNext = res.hasNext;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  public async getAllUsersTaggedPosts(disableComments = false): Promise<Post[]> {
    const res = await this._baseQuery
      .filter(`TaggedUsers/EMail eq '${userService.currentUser().email}'`)
      .getPaged<IPostServerObj[]>();
    this._next = res.getNext.bind(res);
    this.hasNext = res.hasNext;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  public async getNext(disableComments = false): Promise<Post[]> {
    const res = await this._next();
    this._next = res?.getNext.bind(res);
    this.hasNext = res?.hasNext || false;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  private async mergeCommentCount(_posts: Post[]): Promise<Post[]> {
    const commentCounts = await commentService.batchGetCommentCount(_posts);
    const postCopy = [..._posts];
    commentCounts.forEach((commentCount) => {
      const i = findIndex(postCopy, (post) => post.id === commentCount.value[0].itemId);
      postCopy[i].comments = new CommentsRepository(commentCount);
    });
    return postCopy;
  }
}

export const imageService = new ImageService();
