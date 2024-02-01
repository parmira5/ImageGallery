import { PagedItemCollection } from "@pnp/sp/items";
import { IPostServerObj } from "./IPostServerObj";
import { Post } from "./Post";

export class PostsRepository {
  results: Post[];
  getNext: (() => Promise<PagedItemCollection<IPostServerObj[]> | null>) | undefined;
  hasNext: boolean;

  constructor(_posts?: PagedItemCollection<IPostServerObj[]>) {
    this.results = _posts?.results?.map((_post) => new Post(_post)) || [];
    this.getNext = _posts?.getNext.bind(_posts);
    this.hasNext = !!_posts?.hasNext;
  }
}
