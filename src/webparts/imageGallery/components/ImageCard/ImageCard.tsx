import * as React from "react";
import styles from "./ImageCard.module.scss";
import { Icon, Text } from "@fluentui/react";
import { chatIconStyles, textStyles } from "./fluentui.styles";
import { Post } from "../../../../models/Post";

interface IImageOverlay {
    id: number;
    title: string;
    description: string;
    commentCount: number;
}

const ImageOverlay = ({ description, title, id, commentCount }: IImageOverlay): JSX.Element => {
    return (
        <div className={styles.imageDetails}>
            <div className={styles.commentDetails}>
                <Icon styles={chatIconStyles} iconName="CommentSolid" />
                <Text styles={textStyles} variant="xLarge">
                    {commentCount}
                </Text>
            </div>
            <Text variant="mediumPlus" styles={textStyles}>
                {description}
            </Text>
        </div>
    );
};

interface IImageCard {
    id: number;
    post: Post;
    onClick(post: Post): void;
}

const ImageCard = ({
    id,
    post,
    onClick,
}: IImageCard): JSX.Element => {
    return (
        <div tabIndex={0} className={styles.imageCard} onClick={handeImageCardClick}>
            <ImageOverlay id={id} description={post.description} title={post.title} commentCount={post.comments.commentCount} />
            <img src={post.imageThumbnailPath} alt="Test" />
        </div>
    );

    function handeImageCardClick(): void {
        onClick(post);
    }
};

export default React.memo(ImageCard, (prevProps, newProps) => {
    return (prevProps.post.comments.commentCount === newProps.post.comments.commentCount && prevProps.post.description === newProps.post.description && prevProps.id === newProps.id && prevProps.post.imagePath === newProps.post.imagePath)
});
