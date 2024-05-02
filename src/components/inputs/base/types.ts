import { ComponentPropsWithRef } from "react"

export interface BaseInputProps extends ComponentPropsWithRef<"input"> {
  name: string, 
  label?: string, 
  className?: string, 
  inputClass?: string, 
  rounded?: boolean
}

