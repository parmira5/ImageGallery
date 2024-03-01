import * as React from "react";
import { commentService } from "../services/commentService";
import { CommentObj } from "../models/CommentObj";

type TPostComments = {
  comments: CommentObj[];
  isLoading: boolean;
  hasNext: boolean;
  getNextPage: () => Promise<void>;
  postComment: (commentText: string) => Promise<void>;
  error: string;
};

export const useComments = (postId: number | undefined): TPostComments => {
  const [comments, setComments] = React.useState<CommentObj[]>([]);
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasNext, setHasNext] = React.useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    if (postId) {
      commentService
        .getComments(postId)
        .then((res) => {
          setComments(res);
          setHasNext(commentService.hasNext);
          setIsLoading(false);
        })
        .catch((e) => {
          setError(e);
          setIsLoading(false);
        });
    } else {
      setComments([]);
      setIsLoading(false);
    }
  }, [postId]);

  async function getNextPage(): Promise<void> {
    console.log("get next page");
    try {
      const nextSet = await commentService.getNext();
      if (nextSet) {
        setComments((prev) => [...prev, ...nextSet]);
        setHasNext(commentService.hasNext);
      }
    } catch (error) {
      setError(error);
    }
  }

  async function postComment(commentText: string): Promise<void> {
    if (postId) {
      await commentService.postComment(postId, commentText);
      const comments = await commentService.getComments(postId);
      setComments(comments);
    }
  }

  return { comments, isLoading, hasNext, getNextPage, postComment, error };
};
