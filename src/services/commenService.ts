import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { Guid } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { spfi, SPFx } from "@pnp/sp";
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
import { Post } from "../models/Post";
import { configService } from "./configService";
import { CommentObj } from "../models/CommentObj";
import { ICommentServerObj } from "../models/ICommentServerObj";

export interface ICommentService {
    getComments(imageId: number, nextPage?: string): Promise<CommentObj[]>;
    postComment(imageId: number, text: string): Promise<IComment & ICommentInfo>;
}

export class CommentService {
    public static readonly serviceKey: ServiceKey<ICommentService> = ServiceKey.create<ICommentService>(
        "SPFx:SampleService",
        CommentService
    );

    private _spHttpClient: SPHttpClient;
    private _pageContext: PageContext;
    private _baseQuery: string;
    private _odataAddOns = "?$inlineCount=AllPages&%24top=21"
    private _nextLink: string;
    public hasNext = false;

    public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient): void {
        this._spHttpClient = spHttpClient;
        serviceScope.whenFinished(() => {
            this._pageContext = serviceScope.consume(PageContext.serviceKey);
            this._baseQuery = `${this._pageContext.site.absoluteUrl}/_api/web/lists/getByTitle('${configService._listName}')`;
        });
    }

    public async getComments(imageId: number, nextPage?: string): Promise<CommentObj[]> {
        const base = this._baseQuery;
        const odata = this._odataAddOns;
        const resp = await this._spHttpClient.get(`${base}/items/getById('${imageId}')/comments${odata}`, SPHttpClient.configurations.v1);
        const json = await resp.json()
        this._nextLink = json["@odata.nextLink"] || "";
        this.hasNext = !!this._nextLink;
        console.log(this._nextLink)
        return json.value.map((comment: ICommentServerObj) => new CommentObj(comment))
    }

    public async getNext(): Promise<CommentObj[]> {
        if (this._nextLink) {
            const resp = await this._spHttpClient.get(this._nextLink, SPHttpClient.configurations.v1);
            const json = await resp.json()
            this._nextLink = json["@odata.nextLink"] || "";
            this.hasNext = !!this._nextLink;
            return json.value.map((comment: ICommentServerObj) => new CommentObj(comment))
        }
        else return [];
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

