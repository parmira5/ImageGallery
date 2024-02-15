import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  type IPropertyPaneConfiguration,
  PropertyPaneChoiceGroup,
  PropertyPaneToggle,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneLabel,
  PropertyPaneHorizontalRule,
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
import { PropertyPaneFilterPicker } from "../../propertyPane/PropertyPaneImagePicker";

import { listService } from "../../services/listService";
import { IFilter } from "../../models/IFilter";
import { TDynamicValue } from "../../models/TDynamicValues";
import { IFilterItem } from "../../models/IFilterItem";
import { startOfDay } from "date-fns";

export interface IImageGalleryWebPartProps {
  appType: AppType;
  carouselHeader: string;
  columnCount: ColumnCount;
  showSeeAll: boolean;
  showSubmit: boolean;
  pageSize: number;
  showPaginationControl: boolean;
  filters: IFilter[];
  filterType: FilterType;
}

export default class ImageGalleryWebPart extends BaseClientSideWebPart<IImageGalleryWebPartProps> {
  public async render(): Promise<void> {
    if (!this.properties) return;
    const initialContext = {
      ...this.properties,
      filters: this._buildFilterOptions(this.properties.filters),
      defaultFilter: this._getDefaultFilterOption(this.properties.filters),
      baseQuery: this._buildBaseQuery(this.properties.filters),
    };
    const element: React.ReactElement<IImageGalleryProps> = (
      <ConfigContext.Provider value={initialContext}>
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
    listService.init(this.context.serviceScope);
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
                { key: ColumnCount.One, text: "Single", iconProps: { officeFabricIconFontName: "SingleColumn" } },
                { key: ColumnCount.Two, text: "Double", iconProps: { officeFabricIconFontName: "DoubleColumn" } },
                { key: ColumnCount.Three, text: "Triple", iconProps: { officeFabricIconFontName: "TripleColumn" } },
                { key: ColumnCount.Four, text: "Quad", iconProps: { officeFabricIconFontName: "QuadColumn" } },
              ],
            }),
            PropertyPaneToggle("showPaginationControl", { label: "Show Pagination Control" }),
          ]
        : [];
    const inlineFilterFields =
      this.properties.filterType === FilterType.Inline
        ? [
            PropertyPaneLabel("", {
              text: "'Apply to All' filters will be applied to all queries and combined using the AND operator.",
            }),
            PropertyPaneFilterPicker("filters", { filters: this.properties.filters }),
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
            description: "Webpart Configuration",
          },
          groups: [
            {
              groupName: "Filters",
              groupFields: [
                PropertyPaneChoiceGroup("filterType", {
                  label: "Source",
                  options: [
                    { key: FilterType.Inline, text: "Inline" },
                    { key: FilterType.Dynamic, text: "Dynamic" },
                  ],
                }),
                PropertyPaneHorizontalRule(),
                ...inlineFilterFields,
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

  private _buildQuery(filter: IFilter) {
    if (filter.isNoFilter) return "";
    if (!filter.filterProperty || !filter.filterValue) return "";
    let value = filter.filterValue;
    if (filter.valueType === "Dynamic" && typeof value === "string") {
      value = this._resolveDynamicValue(value as TDynamicValue);
    }
    if (filter.operator === "startsWith" || filter.operator === "contains") {
      return `${filter.operator}(${filter.filterProperty}, '${value}')`;
    }
    return `${filter.filterProperty} ${filter.operator} '${value}'`;
  }

  private _buildFilterOptions(filters: IFilter[]): IFilterItem[] {
    if (filters.length === 0) return [];
    return filters
      .filter((filter) => filter.filterType === "Vertical")
      .map((filter) => {
        return {
          key: filter.verticalName,
          itemKey: filter.verticalName,
          headerText: filter.verticalName,
          text: filter.verticalName,
          itemProp: this._buildQuery(filter),
          isDefault: filter.isDefault,
        };
      });
  }

  private _getDefaultFilterOption(filters: IFilter[]): IFilterItem | null {
    const filterOptions = this._buildFilterOptions(filters);
    if (filterOptions.length === 0) return null;
    const defaultOption = filterOptions.find((opt) => opt.isDefault);
    if (defaultOption) return defaultOption;
    return null;
  }

  private _resolveDynamicValue(valueName: TDynamicValue): string {
    switch (valueName) {
      case "USER_EMAIL":
        return userService.currentUser().email;
      case "TODAY":
        return startOfDay(new Date()).toISOString();
      default:
        return "";
    }
  }

  private _buildBaseQuery(filters: IFilter[]) {
    return filters
      .filter((filter) => filter.filterType === "All")
      .map((filter) => this._buildQuery(filter))
      .join(" and ");
  }
}
