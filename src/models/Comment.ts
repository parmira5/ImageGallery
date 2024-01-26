import { ICommentInfo } from "@pnp/sp/comments";
import { ICommentServerObj } from "./ICommentServerObj";

export class Comment {
  createdDate: string;
  id: string;
  isLikedByUser: boolean;
  likeCount: number;
  text: string;
  authorName: string;
  authorEmail: string;
  replyCount: number;

  constructor(comment: ICommentServerObj | ICommentInfo) {
    this.createdDate = comment.createdDate;
    this.id = comment.id;
    this.text = comment.text;
    this.authorName = comment.author.name || comment.author.email;
    this.authorEmail = comment.author.email;
    this.replyCount = comment.replyCount;
    this.isLikedByUser = comment.isLikedByUser;
    this.likeCount = comment.likeCount;
  }
}
