import React from "react";
import { IImageGalleryWebPartProps } from "../webparts/imageGallery/ImageGalleryWebPart";
import { AppType } from "../models/AppType";
import { FilterType } from "../models/FilterType";

export const ConfigContext = React.createContext<IImageGalleryWebPartProps>({
  carouselHeader: "",
  appType: AppType.Grid,
  columnCount: 3,
  showSeeAll: true,
  showSubmit: true,
  pageSize: 9,
  showPaginationControl: true,
  filters: [],
  filterType: FilterType.Inline,
});
