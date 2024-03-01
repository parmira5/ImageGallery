import * as React from "react";
import * as ReactDOM from "react-dom";

import { BaseFormCustomizer } from "@microsoft/sp-listview-extensibility";

import ImageGalleryForm, { IImageGalleryFormProps } from "./components/ImageGalleryForm";
import { listService } from "../../services/listService";
import { Post } from "../../models/Post";
import { postService } from "../../services/postService";
import { FormDisplayMode } from "@microsoft/sp-core-library";

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
  private _post = new Post();
  public async onInit(): Promise<void> {
    listService.init(this.context.serviceScope);
    postService.init(this.context.serviceScope, this.context.spHttpClient);
    if (this.displayMode !== FormDisplayMode.New && this.context.itemId) {
      try {
        const post = await postService.getSinglePost(this.context.itemId);
        console.log("post right after call", post);
        if (post) {
          this._post = post;
          console.log("post after", post);
        }
        return Promise.resolve();
      } catch (error) {
        console.log("error");
        return Promise.resolve();
      }
    }
  }

  public render(): void {
    // Use this method to perform your custom rendering.
    const imageGalleryForm: React.ReactElement<{}> = React.createElement(ImageGalleryForm, {
      context: this.context,
      displayMode: this.displayMode,
      onSave: this._onSave,
      onClose: this._onClose,
      item: this._post,
    } as IImageGalleryFormProps);
    ReactDOM.render(imageGalleryForm, this.domElement);
  }

  public onDispose(): void {
    // This method should be used to free any resources that were allocated during rendering.
    ReactDOM.unmountComponentAtNode(this.domElement);
    super.onDispose();
  }

  private _onSave = async (post: Post, fileContent: File): Promise<void> => {
    await postService.createPost(post, fileContent);
    this.formSaved();
  };

  private _onClose = (): void => {
    // You MUST call this.formClosed() after you close the form.
    this.formClosed();
  };
}
