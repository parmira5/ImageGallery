import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/site-users";
import "@pnp/sp/fields";
import { PageContext } from "@microsoft/sp-page-context";
import { FieldTypes } from "@pnp/sp/fields";
import { IPostServerObj } from "../models/IPostServerObj";
import { IDropdownOption } from "@fluentui/react";

export class ListService {
  public static readonly serviceKey: ServiceKey<ListService> = ServiceKey.create<ListService>(
    "SPFx:SampleService",
    ListService
  );
  private _sp: SPFI;
  private _pageContext: PageContext;

  public init(serviceScope: ServiceScope): void {
    serviceScope.whenFinished(() => {
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));
    });
  }

  public async getColumns(listName: string): Promise<IDropdownOption[]> {
    const fieldsOfInterest: (keyof IPostServerObj)[] = [
      "Author",
      "Created",
      "ID",
      "ImageCategory",
      "TaggedUsers",
      "Title",
    ];
    const res = await this._sp.web.lists
      .getByTitle(listName)
      .fields.filter(fieldsOfInterest.map((field) => `(StaticName eq '${field}')`).join(" or "))();

    return res.map((field) => {
      if (field.FieldTypeKind === FieldTypes.User) {
        return { key: `${field.StaticName}/EMail`, text: `${field.StaticName} Email` };
      } else {
        return { key: field.StaticName, text: field.StaticName };
      }
    });
  }

  public async getCategoryOptions(listName: string): Promise<IDropdownOption[]> {
    const field = await this._sp.web.lists.getByTitle(listName).fields.getByTitle("ImageCategory")();
    return field.Choices?.map((choice) => ({ key: choice, text: choice })) || [];
  }
}

export const listService = new ListService();
