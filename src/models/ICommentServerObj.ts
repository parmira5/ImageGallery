export interface ICommentServerObj {
    createdDate: string;
    id: string;
    isLikedByUser: boolean;
    likeCount: 0;
    text: string;
    author: IAuthorServerObj;
    replyCount: number;
}


interface IAuthorServerObj {
    email: string;
    id: number;
    isActive: boolean;
    isExternal: boolean;
    jobTitle: string | null;
    name: string | null;
    userId: string | null;
    userPrincipalName: string | null;
}