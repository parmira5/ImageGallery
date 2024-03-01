import { IListUser } from "./IListUser";
import { IPostServerObj } from "./IPostServerObj";
import { Post } from "./Post";

export class PostServerObj implements Partial<IPostServerObj> {
  ImageDescription: string;
  ImageCategory: string;
  TaggedUsers: Partial<IListUser>[] | string[];

  constructor(post: Post) {
    this.ImageDescription = post.description;
    this.TaggedUsers = post.taggedUsers;
    this.ImageCategory = post.imageCategory;
  }
}
