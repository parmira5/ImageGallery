import { PagedItemCollection } from "@pnp/sp/items";
import { IPostServerObj } from "./IPostServerObj";

export interface IPostsServerObj {
  results: IPostServerObj[];
  getNext(): Promise<PagedItemCollection<IPostsServerObj> | null> | undefined;
  hasNext: boolean;
  nextUrl: string;
}
