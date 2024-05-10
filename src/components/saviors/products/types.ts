import { Dispatch, SetStateAction } from "react";
import { OnClickFn } from "../../../types";

export type ProcessField = "unit_type" | "activity" | "co2e" | "activity_value"
export type ProductStageName = "sourcing" | "processing" | "transport" | "assembly"

export interface ProductProcess {
  unit_type: string,
  activity: string,
  co2e: number | "N/A",
  activity_value: number,
  process: string,
  _id: string,
};

export interface ProductStage {
  num_processes: number,
  processes: ProductProcess[],
  co2e: number,
  stage: string,
};

export interface Product {
  product_id: string,
  name: string,
  _id: string,
  unit_types: string[],
  co2e: number,
  image: string,
  rating?: string,
  stages: ProductStage[],
  published: boolean,
}

export interface PublishPopupProps {
  showPopup: boolean, 
  close: OnClickFn | Function, 
  productName: string, 
  co2e: number, 
  productId: string,
  setPublished: Dispatch<SetStateAction<boolean>>,
  isPublished: boolean,
}