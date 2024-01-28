export interface ICommentServerObj {
  createdDate: string;
  id: string;
  isLikedByUser: boolean;
  likeCount: 0;
  text: string;
  author: IAuthorServerObj;
  replyCount: number;
  parentId: number;
  itemId: number;
}

interface IAuthorServerObj {
  email: string;
  id: number;
  isActive: boolean;
  isExternal: boolean;
  jobTitle: string | undefined;
  name: string | undefined;
  userId: string | undefined;
  userPrincipalName: string | undefined;
}
