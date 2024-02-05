import * as React from "react";
import styles from "./Comments.module.scss";
import InfiniteScroll from "react-infinite-scroller";
import { useWindowSize } from "usehooks-ts";

import { ActionButton, Persona, PersonaSize, TextField } from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { personStyles, textFieldStyles } from "./fluentui.styles";

import { TextEntry } from "./TextEntry";

import { Post } from "../../../../models/Post";
import { commentService } from "../../../../services/commenService";
import { userService } from "../../../../services/userService";
import { CollapsibleInput } from "../CollapsibleInput/CollapsibleInput";
import { CommentObj } from "../../../../models/CommentObj";
import { TaggedUsers } from "../TaggedUsers/TaggedUsers";

interface IComments {
  image: Post;
}

export const Comments = React.forwardRef(({ image }: IComments, ref: React.RefObject<HTMLElement>): JSX.Element => {
  const [commentText, setCommentText] = React.useState("");
  const [comments, setComments] = React.useState<CommentObj[]>([]);
  const [isInputOpen, { setTrue: openInput, setFalse: closeInput }] = useBoolean(false);
  const windowSize = useWindowSize();
  const isMobileLayout = windowSize.width < 1281;

  React.useEffect(() => {
    (async () => await fetchComments())();
  }, []);

  return (
    <section className={styles.comments}>
      <section className={styles.imageDescriptionWrapper}>
        <TextEntry
          authorEmail={image.authorEmail}
          authorName={image.authorName}
          createdDate={image.createdDate}
          text={image.description}
        />
        {!!image.taggedUsers.length && <TaggedUsers users={image.taggedUsers} maxDisplayablePersonas={3} />}
      </section>
      <section style={{ flexGrow: 1, overflow: "auto" }}>
        <div className={styles.mobileInputWrapper}>
          <CollapsibleInput
            isOpen={isInputOpen}
            onCancel={handleCollapseInput}
            onClickExpand={openInput}
            onSave={handleSubmit}
            value={commentText}
            onChangeInput={handleChange}
            expandButtonText="Write a Comment"
            placeHolder="Enter a Comment"
          />
        </div>
        <InfiniteScroll
          pageStart={0}
          className={styles.commentList}
          loadMore={handleInfiniteScroll}
          hasMore={commentService.hasNext}
          useWindow={false}
          getScrollParent={isMobileLayout ? () => ref.current : undefined}
        >
          {comments.map((comment) => (
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
        <Persona size={PersonaSize.size24} styles={personStyles} imageUrl={userService.getCurrentUserPhoto()} />
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

  function handleChange(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    if (newValue || newValue === "") {
      setCommentText(newValue);
    }
  }

  async function handleInfiniteScroll(): Promise<void> {
    try {
      if (commentService.hasNext) {
        const nextPage = await commentService.getNext();
        setComments((prev) => [...prev, ...nextPage]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(): Promise<void> {
    if (commentText) {
      commentService.postComment(image.id, commentText).then(fetchComments).catch(console.error);
      closeInput();
      setCommentText("");
    }
  }

  async function handleKeyUp(e: React.KeyboardEvent): Promise<void> {
    if (e.key === "Enter" && commentText) {
      commentService.postComment(image.id, commentText).then(fetchComments).catch(console.error);
      closeInput();
      setCommentText("");
    }
  }

  async function fetchComments(): Promise<void> {
    try {
      const res = await commentService.getComments(image.id);
      setComments(res);
    } catch (error) {
      console.error(error);
    }
  }

  function handleCollapseInput() {
    closeInput();
    setCommentText("");
  }
});
