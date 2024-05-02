import { CSSProperties, ComponentPropsWithoutRef, ReactNode } from "react";
import { CSSFontVar, OnClickFn } from "../../types";

export interface BaseModalProps extends ComponentPropsWithoutRef<"div"> {
  visible: boolean,
  close: Function | OnClickFn,
  children: ReactNode,
  titleSize?: CSSFontVar,
  titleText?: string,
}

export interface ModalProps extends BaseModalProps {
  containerStyle?: CSSProperties, 
  backgroundColor?: string,
  className?: string,
  showClose?: boolean,
  small?: boolean,
  closeText?: string,
  adjustCenterForSidebar?: boolean,
}

export interface SideModalProps extends BaseModalProps {
  contentWidth?: string, 
  backgroundColor?: string,
  closeComponent?: ReactNode,
}