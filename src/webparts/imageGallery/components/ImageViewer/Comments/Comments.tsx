import * as React from "react";
import styles from "./Comments.module.scss";
import InfiniteScroll from "react-infinite-scroller";
import { useWindowSize } from "usehooks-ts";

import {
  ActionButton,
  Persona,
  PersonaSize,
  Shimmer,
  ShimmerElementType,
  ShimmerElementsGroup,
  TextField,
} from "@fluentui/react";
import { useBoolean } from "@fluentui/react-hooks";
import { personStyles, textFieldStyles } from "./fluentui.styles";

import { Comment } from "./Comment";

import { Post } from "../../../../../models/Post";
import { commentService } from "../../../../../services/commentService";
import { userService } from "../../../../../services/userService";
import { CollapsibleInput } from "../CollapsibleInput/CollapsibleInput";
import { useComments } from "../../../../../hooks/useComments";

interface IComments {
  image: Post;
}

export const Comments = React.forwardRef(({ image }: IComments, ref: React.RefObject<HTMLElement>): JSX.Element => {
  const [commentText, setCommentText] = React.useState("");

  const { comments, getNextPage, hasNext, isLoading, postComment } = useComments(image.id);
  const [isInputOpen, { setTrue: openInput, setFalse: closeInput }] = useBoolean(false);
  const windowSize = useWindowSize();

  const isMobileLayout = windowSize.width < 1281;

  return (
    <section className={styles.comments}>
      <section className={styles.commentsListWrapper}>
        <div className={styles.mobileInputWrapper}>
          <CollapsibleInput
            isOpen={isInputOpen}
            onCancel={handleCollapseInput}
            onClickExpand={openInput}
            onSave={handleSubmit}
            value={commentText}
            onChangeInput={handleChangeInput}
            expandButtonText="Write a Comment"
            placeHolder="Enter a Comment"
          />
        </div>
        {isLoading && <CommentsShimmer />}
        {!isLoading && (
          <InfiniteScroll
            pageStart={0}
            className={styles.commentList}
            loadMore={handleInfiniteScroll}
            hasMore={commentService.hasNext}
            useWindow={false}
            getScrollParent={isMobileLayout ? () => ref.current : undefined}
          >
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                authorEmail={comment.authorEmail}
                authorName={comment.authorName}
                createdDate={comment.createdDate}
                text={comment.text}
              />
            ))}
          </InfiniteScroll>
        )}
      </section>
      <section className={styles.inputWrapper}>
        <Persona size={PersonaSize.size24} styles={personStyles} imageUrl={userService.getCurrentUserPhoto()} />
        <TextField
          onChange={handleChangeInput}
          styles={textFieldStyles}
          value={commentText}
          placeholder="Enter a comment"
          onKeyUp={handleKeyUp}
        />
        <ActionButton onClick={handleSubmit} iconProps={{ iconName: "Send" }} />
      </section>
    </section>
  );

  function handleChangeInput(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    if (newValue || newValue === "") {
      setCommentText(newValue);
    }
  }

  async function handleInfiniteScroll(): Promise<void> {
    if (hasNext) getNextPage();
  }

  async function handleSubmit(): Promise<void> {
    if (commentText && image.id) {
      postComment(commentText);
      closeInput();
      setCommentText("");
    }
  }

  async function handleKeyUp(e: React.KeyboardEvent): Promise<void> {
    if (e.key === "Enter" && commentText && image.id) {
      postComment(commentText);
      closeInput();
      setCommentText("");
    }
  }

  function handleCollapseInput(): void {
    closeInput();
    setCommentText("");
  }
});

function CommentsShimmer(): JSX.Element {
  const wrapperStyles = { display: "flex" };
  const getCustomElements = (): JSX.Element => {
    return (
      <div style={wrapperStyles}>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.circle, height: 25 },
            { type: ShimmerElementType.gap, width: 16, height: 40 },
          ]}
        />
        <ShimmerElementsGroup
          flexWrap
          width="100%"
          shimmerElements={[
            { type: ShimmerElementType.line, width: "100%", height: 10, verticalAlign: "bottom" },
            { type: ShimmerElementType.line, width: "90%", height: 8 },
            { type: ShimmerElementType.gap, width: "10%", height: 20 },
          ]}
        />
      </div>
    );
  };

  return (
    <div className={styles.shimmerContainer}>
      {Array(20)
        .fill(null)
        .map((_, i) => (
          <Shimmer key={i} customElementsGroup={getCustomElements()} />
        ))}
    </div>
  );
}
