import { IPropertyPaneCustomFieldProps } from "@microsoft/sp-property-pane";
import { IProps as IFilterPickerProps } from "./FilterPicker";
import { IFilter } from "../../models/IFilter";

export interface IPropertyPaneFilterPickerProps extends Omit<IFilterPickerProps, "onChange"> {
  onPropertyChanged?: (newValue: IFilter[]) => void;
}

export interface IPropertyPaneFilterPickerPropsInternal
  extends IPropertyPaneCustomFieldProps,
    IPropertyPaneFilterPickerProps {}
