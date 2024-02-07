import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { type IPropertyPaneConfiguration, PropertyPaneChoiceGroup } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "ImageGalleryWebPartStrings";
import ImageGallery from "./components/ImageGallery";
import { IImageGalleryProps } from "./components/IImageGalleryProps";
import { imageService } from "../../services/imageService";
import { userService } from "../../services/userService";
import { configService } from "../../services/configService";
import { commentService } from "../../services/commenService";
import { IReadonlyTheme } from "@microsoft/sp-component-base";

export interface IImageGalleryWebPartProps {
  layout: string;
  carouselHeader: string;
}

export default class ImageGalleryWebPart extends BaseClientSideWebPart<IImageGalleryWebPartProps> {
  public async render(): Promise<void> {
    const element: React.ReactElement<IImageGalleryProps> = React.createElement(ImageGallery, {
      carouselHeader: this.properties.carouselHeader,
      layout: this.properties.layout,
      onChangeCarouselHeader: this._handleChangeCarouselHeader.bind(this),
      displayMode: this.displayMode,
      isSPA: !this.context.widthCacheKey
    });
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
    this.render()
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneChoiceGroup("layout", {
                  options: [
                    { key: "grid", text: "Grid" },
                    { key: "carousel", text: "Carousel" },
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
  ) {
    this.properties.carouselHeader = newValue || "";
    this.render()
  }
}
