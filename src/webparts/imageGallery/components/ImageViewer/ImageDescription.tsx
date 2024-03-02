import * as React from "react";
import styles from "./ImageViewer.module.scss";
import { Persona, PersonaSize, Stack, Text } from "@fluentui/react";
import { formatDistanceToNow } from "date-fns";
import { TaggedUsers } from "../TaggedUsers/TaggedUsers";
import { commentTextStyles, dateTextStyles } from "./Comments/fluentui.styles";
import { ConfigContext } from "../../../../context/ConfigContext";
import { userService } from "../../../../services/userService";

interface IProps {
  authorEmail: string;
  authorName: string;
  createdDate: string;
  description: string;
  taggedUsers: any[];
  separator?: boolean;
}

export const ImageDescription = ({
  authorEmail,
  authorName,
  createdDate,
  description,
  taggedUsers,
  separator = false,
}: IProps) => {
  const { taggingDisabled } = React.useContext(ConfigContext);
  const imageUrl = userService.getUserPhotoByEmail(authorEmail, "S");
  return (
    <section className={`${styles.imageDescriptionWrapper}${separator ? ` ${styles.separator}` : ""}`}>
      <Stack horizontal horizontalAlign="start">
        <Persona
          imageUrl={imageUrl}
          size={PersonaSize.size24}
          styles={{ root: { position: "relative", top: "3px", minWidth: 40 } }}
        />
        <Stack tokens={{ childrenGap: 3 }}>
          <Text styles={commentTextStyles} variant="smallPlus">
            <b>{authorName}</b> <span>{description}</span>
          </Text>
          {!!taggedUsers.length && !taggingDisabled && <TaggedUsers users={taggedUsers} maxDisplayablePersonas={3} />}
          <Text styles={dateTextStyles} variant="smallPlus">
            {createdDate && formatDistanceToNow(new Date(createdDate))} ago
          </Text>
        </Stack>
      </Stack>
    </section>
  );
};
