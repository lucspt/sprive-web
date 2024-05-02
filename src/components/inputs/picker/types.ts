import { Ref } from "react"

export interface PickerItem {
  label: any, value: any
};

export interface DropdownPickerProps {
  name?: string,
  values: PickerItem[]  
  value?: any,
  rounded?: boolean,
  buttonType?: "button"|"submit", 
  label?: string,
  noneOption?: boolean,
  noneOptionLabel?: any,
  noneOptionValue?: any,
  reactRef?: Ref<HTMLDivElement>,
  required?: boolean,
  defaultValue?: any,
  onChange?: Function,
  controlled?: boolean,
  readOnly?: boolean,
};