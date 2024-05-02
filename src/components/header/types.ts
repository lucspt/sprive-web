import { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react"
import { CSSFontVar } from "../../types"

export interface HeaderProps extends ComponentPropsWithoutRef<"header"> {
  fontSize?: CSSFontVar,
  className?: string, 
  children?: ReactNode, 
  text: string,
  style?: CSSProperties,
}