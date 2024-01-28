import { Post } from "./Post";
import { findIndex } from "@microsoft/sp-lodash-subset";

export class PostsRepository {
    items: Post[]

    constructor(_posts?: Post[]) {
        this.items = _posts || [];
    }

    public updatePost(post: Post) {
        let i = findIndex(this.items, (_post) => post.id === _post.id)
        this.items[i] = post;
    }
}
