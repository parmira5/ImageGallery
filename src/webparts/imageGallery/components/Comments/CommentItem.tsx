import * as React from "react";
import { commentTextStyles } from "./fluentui.styles";
import { CommentObj } from "../../../../models/CommentObj";
import { formatDistanceToNow } from "date-fns";
import { Persona, PersonaSize, Text } from "@fluentui/react";
import styles from "./Comments.module.scss";

interface ICommentComponent {
  comment: CommentObj;
}

export const CommentItem = ({ comment }: ICommentComponent): JSX.Element => {
  const photo = `https://r3v365.sharepoint.com/_layouts/15/userphoto.aspx?size=S&username=${comment.authorEmail}`;

  return (
    <section className={styles.comment}>
      <Persona imageUrl={photo} size={PersonaSize.size24} />
      <div className={styles.commentBody}>
        <Text styles={commentTextStyles} variant="smallPlus">
          <b>{comment.authorName}</b> {comment.text}
        </Text>
        <Text variant="smallPlus">{formatDistanceToNow(new Date(comment.createdDate))} ago</Text>
      </div>
    </section>
  );
};
