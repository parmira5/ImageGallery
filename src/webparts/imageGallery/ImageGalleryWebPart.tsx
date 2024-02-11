import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneChoiceGroup,
  PropertyPaneToggle,
  PropertyPaneTextField,
  PropertyPaneSlider,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import ImageGallery from "./components/ImageGallery";
import { IImageGalleryProps } from "./components/IImageGalleryProps";
import { imageService } from "../../services/imageService";
import { userService } from "../../services/userService";
import { configService } from "../../services/configService";
import { commentService } from "../../services/commenService";
import { IReadonlyTheme } from "@microsoft/sp-component-base";
import { ConfigContext } from "../../context/ConfigContext";
import { AppType } from "../../models/AppType";
import { ColumnCount } from "../../models/ColumnCount";
import { FilterType } from "../../models/FilterType";

export interface IImageGalleryWebPartProps {
  appType: AppType;
  carouselHeader: string;
  columnCount: ColumnCount;
  showSeeAll: boolean;
  showSubmit: boolean;
  pageSize: number;
  showPaginationControl: boolean;
}

export default class ImageGalleryWebPart extends BaseClientSideWebPart<IImageGalleryWebPartProps> {
  public async render(): Promise<void> {
    console.log("propertoes", this.properties);

    const element: React.ReactElement<IImageGalleryProps> = (
      <ConfigContext.Provider value={this.properties}>
        <ImageGallery
          onChangeCarouselHeader={this._handleChangeCarouselHeader.bind(this)}
          displayMode={this.displayMode}
        />
      </ConfigContext.Provider>
    );
    ReactDom.render(element, this.domElement);
  }

  protected onInit(): Promise<void> {
    configService.init(this.context.serviceScope, this.context.spHttpClient);
    imageService.init(this.context.serviceScope, this.context.spHttpClient);
    commentService.init(this.context.serviceScope, this.context.spHttpClient);
    userService.init(this.context.serviceScope, this.context.spHttpClient);
    return super.onInit();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected onThemeChanged(theme: IReadonlyTheme | undefined): void {
    this.render();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    const layoutFields =
      this.properties.appType === AppType.Grid
        ? [
          PropertyPaneChoiceGroup("columnCount", {
            options: [
              { key: ColumnCount.Two, text: "Two" },
              { key: ColumnCount.Three, text: "Three" },
              { key: ColumnCount.Four, text: "Four" },
              { key: ColumnCount.Five, text: "Five" },
            ],
          }),
          PropertyPaneToggle("showPaginationControl", { label: "Show Pagination Control" }),
        ]
        : [];
    return {
      pages: [
        {
          header: {
            description: "Webpart Configuration",
          },
          groups: [
            {
              groupName: "Layout",
              groupFields: [
                PropertyPaneChoiceGroup("appType", {
                  options: [
                    { key: AppType.FullPageApp, text: "Full Page (Requires full width or SPA page)" },
                    { key: AppType.Grid, text: "Grid" },
                    { key: AppType.Carousel, text: "Carousel" },
                  ],
                }),
                ...layoutFields,
                PropertyPaneSlider("pageSize", { min: 2, max: 15, label: "Page Size" }),
              ],
            },
            {
              groupName: "Command Bar",
              groupFields: [
                PropertyPaneToggle("showSeeAll", { label: "Show See All" }),
                PropertyPaneTextField("seeAllLink", {
                  label: "See All Link Path",
                  disabled: !this.properties.showSeeAll,
                }),
                PropertyPaneToggle("showSubmit", { label: "Show Submit Button" }),
              ],
            },
          ],
        },
        {
          header: {
            description: "Filters",
          },
          groups: [
            {
              groupFields: [
                PropertyPaneChoiceGroup("filterType", {
                  label: "Source",
                  options: [
                    { key: FilterType.Inline, text: "Inline" },
                    { key: FilterType.Dynamic, text: "Dynamic" },
                  ],
                }),
              ],
            },
          ],
        },
      ],
    };
  }

  private _handleChangeCarouselHeader(
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ): void {
    this.properties.carouselHeader = newValue || "";
    this.render();
  }
}
