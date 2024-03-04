import * as React from "react";
import { textStyles } from "./fluentui.styles";
import { formatDistanceToNow } from "date-fns";
import { Persona, PersonaSize, Stack, Text } from "@fluentui/react";
import styles from "./Comments.module.scss";
import { userService } from "../../../../../services/userService";

interface IProps {
  authorName: string;
  authorEmail: string;
  text: string;
  createdDate: string;
}

export const Comment = ({ authorEmail, authorName, text, createdDate }: IProps): JSX.Element => {
  const imageUrl = userService.getUserPhotoByEmail(authorEmail, "S");
  return (
    <Stack horizontal>
      <Persona
        imageUrl={imageUrl}
        size={PersonaSize.size24}
        styles={{ root: { position: "relative", top: "3px", minWidth: 40 } }}
      />
      <div className={styles.commentBody}>
        <Text styles={textStyles()} variant="smallPlus">
          <b>{authorName}</b> <span>{text}</span>
        </Text>
        <Text styles={textStyles()} variant="smallPlus">
          {createdDate && formatDistanceToNow(new Date(createdDate))} ago
        </Text>
      </div>
    </Stack>
  );
};
