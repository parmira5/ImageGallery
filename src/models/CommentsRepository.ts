import { CommentObj } from "./CommentObj";
import { ICommentsServerObj } from "./ICommentsServerObj";

export class CommentsRepository {
  comments: CommentObj[];
  nextPage: string;
  commentCount: number;

  constructor(comments?: ICommentsServerObj) {
    this.comments = comments?.value.map((_comment) => new CommentObj(_comment)) || [];
    this.nextPage = comments?.["@odata.nextLink"] || "";
    this.commentCount = comments?.["@odata.count"] || 0;
  }

  get hasNext() {
    return this.comments.length < this.commentCount
  }
}
