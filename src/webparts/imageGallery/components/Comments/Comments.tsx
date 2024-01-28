import * as React from "react";
// import { imageService } from "../../../../services/imageService";
import { TextEntry } from "./TextEntry";
import { ActionButton, Persona, PersonaSize, TextField } from "@fluentui/react";
import styles from "./Comments.module.scss";
import { personStyles, textFieldStyles } from "./fluentui.styles";
import { Post } from "../../../../models/Post";
import { imageService } from "../../../../services/imageService";
import { CommentsRepository } from "../../../../models/CommentsRepository";
import InfiniteScroll from "react-infinite-scroller";
import { cloneDeep } from "@microsoft/sp-lodash-subset";

interface IComments {
  image: Post;
}

export const Comments = ({ image }: IComments): JSX.Element => {
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState<CommentsRepository>(new CommentsRepository());

  React.useEffect(() => {
    updateComments();
  }, []);

  return (
    <section className={styles.comments}>
      <section className={styles.imageDescriptionWrapper}>
        <TextEntry
          authorEmail={image.authorEmail}
          authorName={image.authorName}
          createdDate={image.createdDate}
          text={image.description}
          separator
        />
      </section>
      <section key={comments.commentCount} style={{ flexGrow: 1, overflow: "auto" }}>
        <InfiniteScroll
          pageStart={0}
          className={styles.commentList}
          loadMore={handleInfiniteScroll}
          hasMore={comments.comments.length < comments.commentCount}
          useWindow={false}
        >
          {comments.comments.map((comment) => (
            <TextEntry
              key={comment.id}
              authorEmail={comment.authorEmail}
              authorName={comment.authorName}
              createdDate={comment.createdDate}
              text={comment.text}
            />
          ))}
        </InfiniteScroll>
      </section>
      <section className={styles.inputWrapper}>
        <Persona size={PersonaSize.size24} styles={personStyles} />
        <TextField
          onChange={handleChange}
          styles={textFieldStyles}
          value={commentText}
          placeholder="Enter a comment"
          onKeyUp={handleKeyUp}
        />
        <ActionButton onClick={handleSubmit} iconProps={{ iconName: "Send" }} />
      </section>
    </section>
  );

  function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) {
    if (newValue) {
      setCommentText(newValue);
    }
  }

  function handleInfiniteScroll() {
    if (comments.nextPage)
      imageService
        .getComments(image.id, comments.nextPage)
        .then((res) => {
          const _comments = cloneDeep(comments);
          _comments.comments = [...comments.comments, ...res.comments];
          _comments.nextPage = res.nextPage;
          setComments(_comments);
        })
        .catch(console.error);
  }

  async function handleSubmit() {
    imageService.postComment(image.id, commentText).then(updateComments).catch(console.error);
    setCommentText("");
  }

  async function handleKeyUp(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      imageService.postComment(image.id, commentText).then(updateComments).catch(console.error);
      setCommentText("");
    }
  }

  function updateComments() {
    imageService
      .getComments(image.id)
      .then((res) => {
        setComments(res);
      })
      .catch(console.error);
  }
};
