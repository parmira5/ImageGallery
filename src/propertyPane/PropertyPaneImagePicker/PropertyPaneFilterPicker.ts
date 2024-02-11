import * as React from "react";
import * as ReactDOM from "react-dom";

import { IPropertyPaneField, PropertyPaneFieldType } from "@microsoft/sp-property-pane";
import { IPropertyPaneFilterPickerProps, IPropertyPaneFilterPickerPropsInternal } from "./IPropertyPaneFilterPicker";

import { FilterPicker, IProps as IFilterPickerProps } from "./FilterPicker";
// import { Guid } from "@microsoft/sp-core-library";
import { IFilter } from "./Filter";

export class PropertyPaneFilterPickerBuilder implements IPropertyPaneField<IPropertyPaneFilterPickerPropsInternal> {
    public properties: IPropertyPaneFilterPickerPropsInternal;
    public targetProperty: string;
    public type: PropertyPaneFieldType = PropertyPaneFieldType.Custom;
    private _elem: HTMLElement;

    private _onChangeCallback: (targetProperty: string, newValue: IFilter[]) => void;

    public constructor(targetProperty: string, properties: IPropertyPaneFilterPickerProps) {

        this.targetProperty = targetProperty;
        this.properties = {
            ...properties,
            onRender: this._onRender.bind(this),
            onDispose: this._onDispose.bind(this),
            key: "test",
        };
    }

    private _onDispose(domElement: HTMLElement): void {
        ReactDOM.unmountComponentAtNode(domElement);
    }

    public render(): void {
        if (!this._elem) {
            return;
        }
        this._onRender(this._elem);
    }

    public _onRender(
        domElement: HTMLElement,
        context?: any,
        changeCallback?: (targetProperty?: string, newValue?: IFilter[]) => void
    ): void {
        if (!this._elem) {
            this._elem = domElement;
        }
        const props: IPropertyPaneFilterPickerProps = this.properties as IPropertyPaneFilterPickerProps;

        const propertyPaneControl = React.createElement<IFilterPickerProps>(FilterPicker, {
            ...props,
            onChange: this._onChanged.bind(this)
        });

        ReactDOM.render(propertyPaneControl, domElement);

        if (changeCallback) this._onChangeCallback = changeCallback;
    }

    private _onChanged(newValue: IFilter[]): void {
        // if (this.properties.onPropertyChanged) {
        //     this.properties.onPropertyChanged(newValue);
        // }
        if (this._onChangeCallback) {
            this._onChangeCallback(this.targetProperty, newValue);
        }
    }
}

export function PropertyPaneFilterPicker(
    targetProperty: string,
    properties: IPropertyPaneFilterPickerProps
): IPropertyPaneField<IPropertyPaneFilterPickerPropsInternal> {
    return new PropertyPaneFilterPickerBuilder(targetProperty, properties);
}
