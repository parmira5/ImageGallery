import { Comment } from "./Comment";
import { ICommentsServerObj } from "./ICommentsServerObj";

export class CommentsObj {
  comments: Comment[];
  nextPage: string;
  commentCount: number;

  constructor(comments: ICommentsServerObj) {
    this.comments = comments.value.map((_comment) => new Comment(_comment));
    this.nextPage = comments["@odata.nextLink"];
    this.commentCount = comments["@odata.count"];
  }
}
