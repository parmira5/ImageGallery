import React from "react";
import { IImageGalleryWebPartProps } from "../webparts/imageGallery/ImageGalleryWebPart";
import { AppType } from "../models/AppType";

export const ConfigContext = React.createContext<IImageGalleryWebPartProps>({
  carouselHeader: "",
  layout: AppType.Grid,
});
