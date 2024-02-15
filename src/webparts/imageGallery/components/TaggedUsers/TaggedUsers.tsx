import { Facepile, PersonaSize, Callout, Text, IFacepilePersona } from "@fluentui/react";
import * as React from "react";
import { IListUser } from "../../../../models/IListUser";
import { useBoolean } from "@fluentui/react-hooks";
import styles from "./TaggedUsers.module.scss";
import { textBoxStyles } from "./fluentui.styles";

interface IProps {
  users: Partial<IListUser>[];
  maxDisplayablePersonas: number;
}

export const TaggedUsers = ({ users, maxDisplayablePersonas }: IProps): JSX.Element => {
  const [isCalloutVisible, { toggle: toggleIsCalloutVisible }] = useBoolean(false);

  const facepileItems: IFacepilePersona[] = users.slice(0, maxDisplayablePersonas).map((user) => ({
    imageInitials: `${user.FirstName?.[0]}${user.LastName?.[0]}`,
    personaName: `${user.FirstName} ${user.LastName}`,
  }));
  const overFlow = users.slice(maxDisplayablePersonas, users.length);

  return (
    <div className={styles.taggedUsers}>
      <Text variant="small" as={"span"}>
        Tagged
      </Text>
      <Facepile
        styles={{ root: { display: "inline" } }}
        maxDisplayablePersonas={maxDisplayablePersonas}
        personaSize={PersonaSize.size24}
        personas={facepileItems}
      />
      {!!overFlow.length && (
        <>
          <Text onClick={toggleIsCalloutVisible} id="asdf" variant="small" styles={textBoxStyles}>
            and{" "}
            <b>
              {overFlow.length} {`other${overFlow.length > 1 ? "s" : ""}`}
            </b>
          </Text>
          {isCalloutVisible && (
            <Callout
              className={styles.callout}
              isBeakVisible={true}
              role="dialog"
              gapSpace={0}
              target={`#asdf`}
              onDismiss={toggleIsCalloutVisible}
              setInitialFocus
            >
              {overFlow.map((user, i) => (
                <Text key={i} variant="xSmall">
                  {user.FirstName} {user.LastName}
                </Text>
              ))}
            </Callout>
          )}
        </>
      )}
    </div>
  );
};
