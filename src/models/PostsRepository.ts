import { PagedItemCollection } from "@pnp/sp/items";
import { IPostServerObj } from "./IPostServerObj";
import { Post } from "./Post";
import { cloneDeep } from "@microsoft/sp-lodash-subset";

export class PostsRepository {
  results: Post[];
  getNext: (() => Promise<PagedItemCollection<IPostServerObj[]> | null>);
  hasNext: boolean;

  constructor(_posts?: PagedItemCollection<IPostServerObj[]> | null) {
    this.results = _posts?.results?.map((_post) => new Post(_post)) || [];
    this.getNext = _posts?.getNext.bind(_posts);
    this.hasNext = !!_posts?.hasNext;
  }

  public addPreviousPages(_posts: Post[]) {
    this.results = [..._posts, ...this.results]
    return cloneDeep(this);
  }

  public async getNextPage() {
    if (this.hasNext && this.getNext) {
      const next = await this.getNext();
      return new PostsRepository(next);
    }
  }

}
