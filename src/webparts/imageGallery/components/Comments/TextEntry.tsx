import * as React from "react";
import { commentTextStyles } from "./fluentui.styles";
import { formatDistanceToNow } from "date-fns";
import { Persona, PersonaSize, Text } from "@fluentui/react";
import styles from "./Comments.module.scss";

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
}: ITextEntry) => {
  const imageUrl = `https://r3v365.sharepoint.com/_layouts/15/userphoto.aspx?size=S&username=${authorEmail}`;
  const separatorStyles = separator
    ? {
        paddingBottom: "8px",
        borderBottom: "1px solid #EBEBEB",
      }
    : undefined;
  return (
    <section className={styles.comment} style={separatorStyles}>
      <Persona
        imageUrl={imageUrl}
        size={PersonaSize.size24}
        styles={{ root: { position: "relative", top: "3px" } }}
      />
      <div className={styles.commentBody}>
        <Text styles={commentTextStyles} variant="smallPlus">
          <b>{authorName}</b> <span>{text}</span>
        </Text>
        <Text variant="smallPlus">
          {createdDate && formatDistanceToNow(new Date(createdDate))} ago
        </Text>
      </div>
      <hr />
    </section>
  );
};
