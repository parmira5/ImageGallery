import * as React from "react";
import { imageService } from "../../../../services/imageService";
import { Comment } from "../../../../models/Comment";
import { TextEntry } from "./TextEntry";
import { ActionButton, Persona, PersonaSize, TextField } from "@fluentui/react";
import styles from "./Comments.module.scss";
import { personStyles, textFieldStyles } from "./fluentui.styles";
import { Image } from "../../../../models/Image";

interface IComments {
  image: Image;
}

export const Comments = ({ image }: IComments) => {
  //   const [isLoading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState<Comment[]>([]);

  React.useState(() => {
    imageService
      .getComments(image.id)
      .then((res) => setComments(res))
      .catch(console.error);
  });

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
        {comments.map((comment) => (
          <TextEntry
            authorEmail={comment.authorEmail}
            authorName={comment.authorName}
            createdDate={comment.createdDate}
            text={comment.text}
          />
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
