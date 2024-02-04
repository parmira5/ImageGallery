import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { Guid } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { spfi, SPFx } from "@pnp/sp";
import { JSONParse } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/comments";
import "@pnp/sp/batching";
import "@pnp/sp/fields";

import { IComment, ICommentInfo } from "@pnp/sp/comments";

import { SPHttpClient } from "@microsoft/sp-http-base";
import { ICommentsServerObj } from "../models/ICommentsServerObj";
import { CommentsRepository } from "../models/CommentsRepository";
import { Post } from "../models/Post";

export interface ICommentService {
    getComments(imageId: number, nextPage?: string): Promise<CommentsRepository>;
    postComment(imageId: number, text: string): Promise<IComment & ICommentInfo>;
}

export class CommentService {
    public static readonly serviceKey: ServiceKey<ICommentService> = ServiceKey.create<ICommentService>(
        "SPFx:SampleService",
        CommentService
    );
    private _spHttpClient: SPHttpClient;
    private _pageContext: PageContext;

    public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient): void {
        this._spHttpClient = spHttpClient;
        serviceScope.whenFinished(() => {
            this._pageContext = serviceScope.consume(PageContext.serviceKey);
        });
    }

    public async getComments(imageId: number, nextPage?: string): Promise<CommentsRepository> {
        const sp = spfi().using(SPFx({ pageContext: this._pageContext }));
        const res = await sp.web.lists.getByTitle("Image Gallery").items.getById(imageId).using(JSONParse()).comments.top(15)() as ICommentsServerObj;
        return new CommentsRepository(res);
    }

    public async postComment(imageId: number, text: string): Promise<IComment & ICommentInfo> {
        const sp = spfi().using(SPFx({ pageContext: this._pageContext }));
        return sp.web.lists.getByTitle("Image Gallery").items.getById(imageId).comments.add(text);
    }

    public async batchGetCommentCount(posts: Post[]): Promise<ICommentsServerObj[]> {
        const batchId = Guid.newGuid().toString();
        const batchIdentifierTemplate = `--batch_${batchId}\nContent-type: application/http\nContent-Transfer-Encoding: binary`;
        const requestTemplate = `GET https://r3v365.sharepoint.com/sites/NEWSSITE2/_api/web/lists/getByTitle('<<LIST>>')/items(<<ID>>)/comments?$inlineCount=AllPages&%24top=1 HTTP/1.1\naccept: application/json`;
        let requestBody = "";
        posts.forEach((post) => {
            requestBody += `${batchIdentifierTemplate}\n\n${requestTemplate
                .replace("<<LIST>>", "Image%20Gallery")
                .replace("<<ID>>", post.id.toString())}\n\n\n\n`;
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
}

export const commentService = new CommentService();

