import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/site-users";
import { SPHttpClient } from "@microsoft/sp-http-base";
import { PageContext, SPUser } from "@microsoft/sp-page-context";
import { PermissionKind } from "@pnp/sp/security";

export class UserService {
  public static readonly serviceKey: ServiceKey<UserService> = ServiceKey.create<UserService>(
    "SPFx:SampleService",
    UserService
  );
  private _sp: SPFI;
  private _pageContext: PageContext;
  private _currentUser: SPUser;

  public init(serviceScope: ServiceScope, spHttpClient: SPHttpClient): void {
    // this._spHttpClient = spHttpClient;
    serviceScope.whenFinished(() => {
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      this._currentUser = this._pageContext.user;
      this._sp = spfi().using(SPFx({ pageContext: this._pageContext }));
    });
  }

  public currentUser(): SPUser {
    return this._currentUser;
  }

  public async currentUserHasAddPemissionsOnImageList(): Promise<boolean> {
    return await this._sp.web.lists.getByTitle("Image Gallery").currentUserHasPermissions(PermissionKind.AddListItems);
  }

  public async currentUserHasFullControlOnImageList(): Promise<boolean> {
    const [hasAdd, hasEdit, hasView, hasDelete] = await Promise.all([
      this._sp.web.lists.getByTitle("Image Gallery").currentUserHasPermissions(PermissionKind.AddListItems),
      this._sp.web.lists.getByTitle("Image Gallery").currentUserHasPermissions(PermissionKind.EditListItems),
      this._sp.web.lists.getByTitle("Image Gallery").currentUserHasPermissions(PermissionKind.DeleteListItems),
      this._sp.web.lists.getByTitle("Image Gallery").currentUserHasPermissions(PermissionKind.ViewListItems),
    ]);
    return hasAdd && hasEdit && hasView && hasDelete;
  }

  public getCurrentUserPhoto(size: PhotoSize = "L"): string {
    return this.getUserPhotoByEmail(this._pageContext.user.email, size);
  }

  public getUserPhotoByEmail(email: string, size: PhotoSize = "L"): string {
    return `/_layouts/15/userphoto.aspx?AccountName=${email}&Size=${size}`;
  }
}

type PhotoSize = "S" | "M" | "L";

export const userService = new UserService();
