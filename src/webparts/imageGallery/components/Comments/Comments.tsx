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

import { TextEntry } from "./TextEntry";

import { Post } from "../../../../models/Post";
import { commentService } from "../../../../services/commenService";
import { userService } from "../../../../services/userService";
import { CollapsibleInput } from "../CollapsibleInput/CollapsibleInput";
import { CommentObj } from "../../../../models/CommentObj";
import { TaggedUsers } from "../TaggedUsers/TaggedUsers";

interface IComments {
  image: Post;
  hideTags: boolean;
}

export const Comments = React.forwardRef(
  ({ image, hideTags }: IComments, ref: React.RefObject<HTMLElement>): JSX.Element => {
    const [commentText, setCommentText] = React.useState("");
    const [comments, setComments] = React.useState<CommentObj[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isInputOpen, { setTrue: openInput, setFalse: closeInput }] = useBoolean(false);
    const windowSize = useWindowSize();
    const isMobileLayout = windowSize.width < 1281;

    React.useEffect(() => {
      (async () => {
        setIsLoading(true);
        await fetchComments();
        setIsLoading(false);
      })();
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
          {!!image.taggedUsers.length && !hideTags && (
            <TaggedUsers users={image.taggedUsers} maxDisplayablePersonas={3} />
          )}
        </section>
        <section className={styles.commentsListWrapper}>
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
          {isLoading && <CommentsShimmer></CommentsShimmer>}
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
                <TextEntry
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

    function handleCollapseInput(): void {
      closeInput();
      setCommentText("");
    }
  }
);

function CommentsShimmer() {
  const wrapperStyles = { display: "flex" };
  const getCustomElements = () => {
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
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((_) => (
        <Shimmer customElementsGroup={getCustomElements()}></Shimmer>
      ))}
    </div>
  );
}