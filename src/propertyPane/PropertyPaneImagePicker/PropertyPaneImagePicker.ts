// import * as React from "react";
// import * as ReactDOM from "react-dom";

// import { IPropertyPaneField, PropertyPaneFieldType } from "@microsoft/sp-property-pane";
// import { IPropertyPaneImagePickerProps, IPropertyPaneImagePickerPropsInternal } from "./IPropertyPaneImagePicker";

// import { v4 as uuidv4 } from "uuid";

// import ImagePicker, { IImagePickerProps } from "./ImagePicker";

// export class PropertyPaneImagePickerBuilder implements IPropertyPaneField<IPropertyPaneImagePickerPropsInternal> {
//   public properties: IPropertyPaneImagePickerPropsInternal;
//   public targetProperty: string;
//   public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
//   private _elem: HTMLElement;

//   private _onChangeCallback: (targetProperty: string, newValue: string) => void;

//   public constructor(targetProperty: string, properties: IPropertyPaneImagePickerProps) {
//     this.targetProperty = targetProperty;
//     this.properties = {
//       ...properties,
//       onRender: this._onRender.bind(this),
//       onDispose: this._onDispose.bind(this),
//       key: uuidv4(),
//     };
//   }

//   private _onDispose(domElement: HTMLElement): void {
//     ReactDOM.unmountComponentAtNode(domElement);
//   }

//   public render(): void {
//     if (!this._elem) {
//       return;
//     }
//     this._onRender(this._elem);
//   }

//   public _onRender(
//     domElement: HTMLElement,
//     context?,
//     changeCallback?: (targetProperty?: string, newValue?) => void
//   ): void {
//     if (!this._elem) {
//       this._elem = domElement;
//     }
//     const props: IPropertyPaneImagePickerProps = this.properties as IPropertyPaneImagePickerProps;

//     const propertyPaneControl = React.createElement<IImagePickerProps>(ImagePicker, {
//       ...props,
//       onSave: this._onChanged.bind(this),
//     });

//     ReactDOM.render(propertyPaneControl, domElement);

//     if (changeCallback) this._onChangeCallback = changeCallback;
//   }

//   private _onChanged(newValue: string): void {
//     if (this.properties.onPropertyChanged) {
//       this.properties.onPropertyChanged(newValue);
//     }
//     if (this._onChangeCallback) {
//       this._onChangeCallback(this.targetProperty, newValue);
//     }
//   }
// }

// export function PropertyPaneImagePicker(
//   targetProperty: string,
//   properties: IPropertyPaneImagePickerProps
// ): IPropertyPaneField<IPropertyPaneImagePickerPropsInternal> {
//   return new PropertyPaneImagePickerBuilder(targetProperty, properties);
// }
