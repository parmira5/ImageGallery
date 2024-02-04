import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/site-users";
import { SPHttpClient } from "@microsoft/sp-http-base";
import { PageContext } from "@microsoft/sp-page-context";
import { InjectHeaders } from "@pnp/queryable";
import { IConfigServerObj } from "../models/IConfigServerObj";

const NO_METADATA = {
  Accept: "application/json;odata=nometadata",
};

const selectFields: (keyof IConfigServerObj)[] = ["Created", "DisableAllComments", "ID"];

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

  public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient): void {
    // this._spHttpClient = spHttpClient;
    serviceScope.whenFinished(() => {
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      this.sitePath = this._pageContext.site.absoluteUrl;
      this._sp = spfi()
        .using(SPFx({ pageContext: this._pageContext }))
        .using(InjectHeaders(NO_METADATA));
    });
  }

  public async getConfig(): Promise<IConfigServerObj> {
    const config = await this._sp.web.lists
      .getByTitle("Image Gallery Config")
      .items.select(selectFields.join(","))
      .orderBy("Created")
      .top(1)();
    return config[0] || [];
  }

  public async updateConfig(config: IConfigServerObj): Promise<IConfigServerObj> {
    const updateResult = await this._sp.web.lists
      .getByTitle("Image Gallery Config")
      .items.getById(config.ID)
      .update(config);
    return await updateResult.item.select(selectFields.join(","))();
  }
}

export const configService = new ConfigService();
