import * as React from "react";
import { IPostServiceOptions, postService } from "../services/postService";
import { Post } from "../models/Post";

type TUserPost = {
  posts: Post[];
  isLoading: boolean;
  isNextLoading: boolean;
  hasNext: boolean;
  getNextPage: () => Promise<void>;
  error: string;
};

export const usePosts = (configOptions: IPostServiceOptions): TUserPost => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isNextLoading, setIsNextLoading] = React.useState(false);
  const [hasNext, setHasNext] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    postService
      .getAllPosts(configOptions)
      .then((res) => {
        setPosts(res);
        setHasNext(postService.hasNext);
        setIsLoading(false);
      })
      .catch((e) => {
        setError(e);
        setIsLoading(false);
      });
  }, [configOptions]);

  async function getNextPage(): Promise<void> {
    try {
      setIsNextLoading(true);
      const nextSet = await postService.getNext(configOptions);
      if (nextSet) {
        setPosts((prev) => [...prev, ...nextSet]);
        setHasNext(postService.hasNext);
        setIsNextLoading(false);
      }
    } catch (error) {
      setError(error);
      setIsNextLoading(false);
    }
  }

  return { posts, isLoading, isNextLoading, hasNext, getNextPage, error };
};
