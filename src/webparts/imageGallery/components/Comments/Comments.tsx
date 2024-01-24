import * as React from "react";
import { imageService } from "../../../../services/imageService";
import { Comment } from "../../../../models/Comment";
import { CommentItem } from "./CommentItem";
import { ActionButton, Persona, PersonaSize, TextField } from "@fluentui/react";
import styles from "./Comments.module.scss";
import { personStyles, textFieldStyles } from "./fluentui.styles";

interface IComments {
  imageId: number;
}

export const Comments = ({ imageId }: IComments) => {
  //   const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState<Comment[]>([]);

  React.useState(() => {
    imageService
      .getComments(imageId)
      .then((res) => setComments(res))
      .catch(console.error);
  });

  return (
    <section className={styles.comments}>
      <section className={styles.commentList}>
        {comments.map((comment) => (
          <CommentItem comment={comment} />
        ))}
      </section>
      <section className={styles.inputWrapper}>
        <Persona size={PersonaSize.size24} styles={personStyles} />
        <TextField styles={textFieldStyles} placeholder="Enter a comment" />
        <ActionButton iconProps={{ iconName: "Send" }} />
      </section>
    </section>
  );
};
