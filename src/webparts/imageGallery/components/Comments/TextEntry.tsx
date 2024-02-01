import * as React from "react";
import { commentTextStyles, dateTextStyles } from "./fluentui.styles";
import { formatDistanceToNow } from "date-fns";
import { Persona, PersonaSize, Text } from "@fluentui/react";
import styles from "./Comments.module.scss";
import { userService } from "../../../../services/userService";

interface ITextEntry {
  authorName: string;
  authorEmail: string;
  text: string;
  createdDate: string;
  separator?: boolean;
}

export const TextEntry = ({
  authorEmail,
  authorName,
  text,
  createdDate,
  separator = false,
}: ITextEntry): JSX.Element => {
  const imageUrl = userService.getUserPhotoByEmail(authorEmail, "S");
  return (
    <section className={`${styles.comment} ${separator ? styles.borderBottom : ""}`}>
      <Persona imageUrl={imageUrl} size={PersonaSize.size24} styles={{ root: { position: "relative", top: "3px" } }} />
      <div className={styles.commentBody}>
        <Text styles={commentTextStyles} variant="smallPlus">
          <b>{authorName}</b> <span>{text}</span>
        </Text>
        <Text styles={dateTextStyles} variant="smallPlus">
          {createdDate && formatDistanceToNow(new Date(createdDate))} ago
        </Text>
      </div>
    </section>
  );
};
