import { CSSProperties, ReactNode } from "react";
import { ProductProcess, ProductStageName } from "../saviors/products/types";
import { OnClickFn } from "../../types";

export interface RatingProps {
  size?: number,
  rating?: string,
  style?: CSSProperties,
  showText?: boolean, 
  children?: ReactNode 
}

export interface DropdownProcessProps {
  name: string, 
  co2e: number, 
  productRating: string, 
  isLast: boolean, 
  expanded: boolean, 
  index: number,
  numProcesses: number,
  edit: Function,
};

export interface ProductCardProps {
  optionsFooter?: boolean, 
  setEditingProcess?: (p: any) => void,
  contentEditable?: boolean,
  stageToExpand?: number
};

interface ExtraEditProcessFields {
  stageIndex?: number, 
  stageName?: ProductStageName, 
  productId?: string, 
  method?: "POST" | "PUT", 
  co2e?: number | "N/A"
}

export interface StageDropdownProps {
  co2e: number, 
  name: string, 
  processes: ProductProcess[], 
  percentage: number, 
  productRating: string,
  setEditingProcess:(p:  Partial<ProductProcess> & ExtraEditProcessFields) => void,
  productId: string,
  shouldExpand: boolean,
};

export interface ProductWidgetProps {
  name: string, 
  // image?: string,
  // rating?: string,
  co2e: number,
  onClick: OnClickFn,
};