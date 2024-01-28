import * as React from "react";
// import { imageService } from "../../../../services/imageService";
import { TextEntry } from "./TextEntry";
import { ActionButton, Persona, PersonaSize, TextField } from "@fluentui/react";
import styles from "./Comments.module.scss";
import { personStyles, textFieldStyles } from "./fluentui.styles";
import { Post } from "../../../../models/Post";
// import { CommentObj } from "../../../../models/CommentObj";

interface IComments {
  image: Post;
}

export const Comments = ({ image }: IComments): JSX.Element => {
  console.log("in comments", image)
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
      <section className={styles.commentList}>
        {image.comments.comments.map((comment) => (
          <TextEntry
            key={comment.id}
            authorEmail={comment.authorEmail}
            authorName={comment.authorName}
            createdDate={comment.createdDate}
            text={comment.text}
          />
        ))}
      </section>
      <section className={styles.inputWrapper}>
        <Persona size={PersonaSize.size24} styles={personStyles} />
        <TextField onChange={handleChange} styles={textFieldStyles} placeholder="Enter a comment" />
        <ActionButton iconProps={{ iconName: "Send" }} />
      </section>
    </section>
  );

  function handleChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) {
    // setNewCommentText(newValue);
  }
};
