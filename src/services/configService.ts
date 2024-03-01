import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/site-users";
import { SPHttpClient } from "@microsoft/sp-http-base";
import { PageContext } from "@microsoft/sp-page-context";
import { InjectHeaders } from "@pnp/queryable";
import { IConfigServerObj } from "../models/IConfigServerObj";
import { IImageGalleryWebPartProps } from "../webparts/imageGallery/ImageGalleryWebPart";

const NO_METADATA = {
  Accept: "application/json;odata=nometadata",
};

const selectFields: (keyof IConfigServerObj)[] = ["DisableAllComments", "ID", "DisableTagging"];

export class ConfigService {
  public static readonly serviceKey: ServiceKey<ConfigService> = ServiceKey.create<ConfigService>(
    "SPFx:SampleService",
    ConfigService
  );
  private _sp: SPFI;
  private _pageContext: PageContext;
  public _listName = "Image Gallery";
  public _configListName = "Image Gallery Config";
  public sitePath: string;
  public galleryId: string;
  public configListId: string;
  public sourceSitePath: string;
  public galleryPath: string;

  public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient, properties: IImageGalleryWebPartProps): void {
    serviceScope.whenFinished(() => {
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      this.sitePath = this._pageContext.site.absoluteUrl;
      this.galleryId = properties.libraryId;
      this.configListId = properties.configListId;
      this.sourceSitePath = properties.sourceSiteId;
      this.galleryPath = `/sites${properties.libraryPath?.split("/sites")[1].split("/Forms")[0]}`;
      this._sp = spfi(this.sourceSitePath)
        .using(SPFx({ pageContext: this._pageContext }))
        .using(InjectHeaders(NO_METADATA));
    });
  }

  public async getConfig(): Promise<IConfigServerObj> {
    const config = await this._sp.web.lists
      .getById(this.configListId)
      .items.select(selectFields.join(","))
      .orderBy("Created")
      .top(1)();
    return config[0] || [];
  }

  public async updateConfig(config: IConfigServerObj): Promise<IConfigServerObj> {
    const updateResult = await this._sp.web.lists.getById(this.configListId).items.getById(config.ID).update(config);
    return await updateResult.item.select(selectFields.join(","))();
  }
}

export const configService = new ConfigService();
