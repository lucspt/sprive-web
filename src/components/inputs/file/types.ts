import { BaseInputProps } from "../base/types";

export interface FileInputProps extends Omit<BaseInputProps, "name"|"type"> {
  requiredColumns: string[],
  fileTypes?: string,
  submitBtn: boolean
}

export interface RequiredColumnsProps {
  columns: string[],
}