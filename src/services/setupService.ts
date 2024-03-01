import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/site-users";
import "@pnp/sp/fields";
import "@pnp/sp/content-types";
import "@pnp/sp/search";
import { PageContext } from "@microsoft/sp-page-context";

export class SetupService {
  public static readonly serviceKey: ServiceKey<SetupService> = ServiceKey.create<SetupService>(
    "SPFx:SampleService",
    SetupService
  );
  private _sp: SPFI;
  private _pageContext: PageContext;

  public async init(serviceScope: ServiceScope): Promise<void> {
    serviceScope.whenFinished(async () => {
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));
    });
  }

  public async findGalleryLib() {
    const res = await this._sp.search("contentClass:STS_List_DocumentLibrary Title=Image+Gallery");
    if (res.PrimarySearchResults.length > 0) {
      return res.PrimarySearchResults[0];
    } else {
      throw new Error("Library not found");
    }
  }

  public async findConfigList() {
    const res = await this._sp.search("contentClass:STS_List Title=Image+Gallery+Config");
    if (res.PrimarySearchResults.length > 0) {
      return res.PrimarySearchResults[0];
    } else {
      throw new Error("Config list not found");
    }
  }
}

export const setupService = new SetupService();
