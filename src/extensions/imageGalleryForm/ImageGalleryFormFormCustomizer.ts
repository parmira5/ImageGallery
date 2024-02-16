import * as React from "react";
import * as ReactDOM from "react-dom";

import { BaseFormCustomizer } from "@microsoft/sp-listview-extensibility";

import ImageGalleryForm, { IImageGalleryFormProps } from "./components/ImageGalleryForm";
import { listService } from "../../services/listService";

/**
 * If your form customizer uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IImageGalleryFormFormCustomizerProperties {
  // This is an example; replace with your own property
  sampleText?: string;
}

export default class ImageGalleryFormFormCustomizer extends BaseFormCustomizer<IImageGalleryFormFormCustomizerProperties> {
  public onInit(): Promise<void> {
    listService.init(this.context.serviceScope);
    return Promise.resolve();
  }

  public render(): void {
    // Use this method to perform your custom rendering.

    const imageGalleryForm: React.ReactElement<{}> = React.createElement(ImageGalleryForm, {
      context: this.context,
      listService: listService,
      displayMode: this.displayMode,
      onSave: this._onSave,
      onClose: this._onClose,
    } as IImageGalleryFormProps);

    ReactDOM.render(imageGalleryForm, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = (): void => {
    // You MUST call this.formSaved() after you save the form.
    this.formSaved();
  };

  private _onClose = (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  };
}
