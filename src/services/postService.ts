import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/comments";
import "@pnp/sp/batching";
import "@pnp/sp/fields";

import { IPostServerObj } from "../models/IPostServerObj";

import { SPHttpClient } from "@microsoft/sp-http-base";
import { IItems, PagedItemCollection } from "@pnp/sp/items";
import { userService } from "./userService";
import { Post } from "../models/Post";
import { commentService } from "./commentService";
import { findIndex } from "@microsoft/sp-lodash-subset";
import { PostServerObj } from "../models/PostServerObj";
import { configService } from "./configService";
import { CommentObj } from "../models/CommentObj";

export interface IPostServiceOptions {
  disableComments: boolean;
  pageSize?: number;
  filter?: string;
  baseQuery?: string;
}

export interface IPostService {
  getAllPosts(config: IPostServiceOptions): Promise<Post[]>;
  getAllUsersPosts(config: IPostServiceOptions): Promise<Post[]>;
  getAllUsersTaggedPosts(config: IPostServiceOptions): Promise<Post[]>;
  getNext(config: IPostServiceOptions): Promise<Post[]>;
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

export class PostService {
  public static readonly serviceKey: ServiceKey<IPostService> = ServiceKey.create<IPostService>(
    "SPFx:SampleService",
    PostService
  );
  private _sp: SPFI;
  private _pageContext: PageContext;
  private _baseQuery: IItems;
  private _next: () => Promise<PagedItemCollection<IPostServerObj[]> | null>;
  public hasNext: boolean;

  public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient): void {
    serviceScope.whenFinished(() => {
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      this._sp = spfi(configService.sourceSitePath).using(SPFx({ pageContext: this._pageContext }));
      this._baseQuery = this._sp.web.lists
        .getById(configService.galleryId)
        .items.select(selectFields.join(","))
        .expand("File, Author, TaggedUsers")
        .orderBy("Created", false);
    });
  }

  public async createPost(post: Post, fileContent: File): Promise<void> {
    console.log(configService.galleryPath);
    const res = await this._sp.web
      .getFolderByServerRelativePath(configService.galleryPath)
      .files.addChunked(fileContent.name, fileContent);

    const item = await res.file.getItem();
    const itemInfo = await item<IPostServerObj>();
    await this._sp.web.lists
      .getById(configService.galleryId)
      .items.getById(itemInfo.ID)
      .update(new PostServerObj(post));
  }

  public async getSinglePost(itemId: number): Promise<Post | undefined> {
    const res = await this._baseQuery
      .getById(itemId)
      .select(selectFields.join(","))
      .expand("File, Author, TaggedUsers")<IPostServerObj>();
    if (!res) return undefined;
    const post = new Post(res);
    return post;
  }

  public async getAllPosts({
    disableComments,
    pageSize,
    filter = "",
    baseQuery = "",
  }: IPostServiceOptions): Promise<Post[]> {
    const combinedQuery = [baseQuery, filter].filter((q) => !!q).join(" and ");
    const res = await this._baseQuery
      .filter(combinedQuery)
      .top(pageSize || 9)
      .getPaged<IPostServerObj[]>();
    this._next = res.getNext.bind(res);
    this.hasNext = res.hasNext;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  public async getAllUsersPosts({ disableComments, pageSize }: IPostServiceOptions): Promise<Post[]> {
    const res = await this._baseQuery
      .top(pageSize || 9)
      .filter(`Author/EMail eq '${userService.currentUser().email}'`)
      .getPaged<IPostServerObj[]>();
    this._next = res.getNext.bind(res);
    this.hasNext = res.hasNext;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  public async getAllUsersTaggedPosts({ disableComments, pageSize }: IPostServiceOptions): Promise<Post[]> {
    const res = await this._baseQuery
      .filter(`TaggedUsers/EMail eq '${userService.currentUser().email}'`)
      .top(pageSize || 9)
      .getPaged<IPostServerObj[]>();
    this._next = res.getNext.bind(res);
    this.hasNext = res.hasNext;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  public async getNext({ disableComments, pageSize }: IPostServiceOptions): Promise<Post[]> {
    const res = await this._next();
    this._next = res?.getNext.bind(res);
    this.hasNext = res?.hasNext || false;
    const posts = res?.results.map((r) => new Post(r)) || [];
    if (!disableComments) return await this.mergeCommentCount(posts);
    return posts;
  }

  private async mergeCommentCount(_posts: Post[]): Promise<Post[]> {
    const commentCounts = await commentService.batchGetCommentCount(_posts);
    if (commentCounts.length > 0) {
      const postCopy = [..._posts];
      commentCounts.forEach((commentCount) => {
        if (commentCount.value.length > 0) {
          const i = findIndex(postCopy, (post) => post.id === commentCount.value[0].itemId);
          postCopy[i].comments = {
            items: commentCount.value.map((comment) => new CommentObj(comment)),
            commentCount: commentCount["@odata.count"],
          };
        }
      });
      return postCopy;
    } else return _posts;
  }
}

export const postService = new PostService();
