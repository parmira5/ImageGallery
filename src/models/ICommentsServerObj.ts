import { ICommentServerObj } from "./ICommentServerObj";

export interface ICommentsServerObj {
  ["@odata.context"]: string;
  ["odata.count"]: number;
  ["@odata.nextLink"]: string;
  value: ICommentServerObj[];
}
