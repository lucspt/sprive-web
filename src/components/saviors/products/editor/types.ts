import { Dispatch, ReactNode, SetStateAction } from "react";
import { Product, ProductProcess, ProductStage, ProductStageName } from "../types";
import { FetcherWithComponents } from "react-router-dom";
import { RequestMethod } from "../../../../types";

export interface CurrentProcessRowProps {
  updateProcess: (key: string, value: string | number) => void,
  process: ProductProcess
}

export interface PartnerProductOptionsProps {
  product: Product,
  setName: Dispatch<SetStateAction<string>>
}

export interface EditPopupProps {
  isVisible: boolean, 
  isPublished: boolean, 
  close: Function,
  productName: string,
  productId: string,
  setProductName: Dispatch<SetStateAction<string>>,
};

export interface UnpublishFirstPopupProps {
  close: Function, 
  children?: ReactNode,
  visible: boolean
};

export interface ProcessEditorTitleProps {
  processName: string, 
  productName: string, 
  stageName: ProductStageName, 
};

export interface OptionsFooterProps {
  stages: ProductStage[], 
  isPublished: boolean, 
  showPublishPopup: Function,
  showEditPopup: Function,
  setWarn: Dispatch<SetStateAction<string[]>>
}

export interface EditingProcessObject extends ProductProcess {
    "method": RequestMethod,
    "stageName": ProductStageName,
    "stageIndex": number
  }

export interface ProcessEditorProps {
  editingProcess: ProductProcess & {
    "method": RequestMethod,
    "stageName": ProductStageName,
  },
  fetcher: FetcherWithComponents<Partial<ProductProcess>>,
  onFinish: Function
}