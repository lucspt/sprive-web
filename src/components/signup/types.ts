import { ComponentPropsWithoutRef, ReactNode } from "react";
import { GHGCategory, Scope } from "../../types";

export interface AccountCreatorInputProps extends Omit<ComponentPropsWithoutRef<"input">, "onChange">{
  name: string,
  onChange?: (val: string) => void,
  onContinue?: Function, 
  validation: (val: string) => boolean | "", 
  validateBeforeContinue?: boolean, 
  validationEndpoint?: string,
  label: string,
  errorMessage?: string,
  showButton: boolean,
  setHasError: Function,
};

export interface MeasurementApplicationsProps {
  chosen: Array<GHGCategory|Scope>, 
  setFormData: Function
}

export interface DefinitionProps {
  scope?: Scope,
  category?: string,
  toggle: Function,
  isChecked: boolean
}

export interface GHGCategoryDropdownProps { 
  category: GHGCategory, 
  name: string, 
  isChecked: boolean,
  toggle: Function
};

export interface ScopeSectionProps {
  scope: Scope, 
  children?: ReactNode, 
  toggle?: Function,
  isChecked?: boolean,
};
