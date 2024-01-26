import * as React from "react";

interface IImageDetails {
  authorImageUrl: string;
  authorName: string;
  description: string;
  commentCount: number;
}

const ImageDetails = ({ authorImageUrl, authorName, commentCount, description }: IImageDetails): JSX.Element => {
  return <div></div>;
};

export default ImageDetails;
