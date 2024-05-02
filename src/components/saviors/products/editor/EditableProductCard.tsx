import { memo, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import { isObjectEmpty } from "../../../../utils/utils";
import { ProductCard } from "../../../products/ProductCard";
import ProcessEditor from "./ProcessEditor";
import { UnpublishFirstPopup } from "./UnpublishFirstPopup";
import { EditingProcessObject } from "./types";
import { Product, ProductProcess } from "../types";

export const EditableProductCard = memo(function EditableProductCard() {
  const [ editingProcess, setEditingProcess ] = useState<EditingProcessObject|{}>({});
  const product = useLoaderData() as Product;
  const [ showUnpublishWarning, setShowUnpublishWarning ] = useState(false);
  const [ stageToExpand, setStageToExpand ] = useState<null|number>(null);

  const onFinishEdit = () => {
    const { stageIndex } = editingProcess as EditingProcessObject;
    setEditingProcess({});
    setStageToExpand(stageIndex);
  };

  const initiateProcessEdit = (p: ProductProcess) => {
    product.published 
      ? setShowUnpublishWarning(true)
      : setEditingProcess(p as ProductProcess)
  };

  const fetcher = useFetcher();

  return isObjectEmpty(editingProcess) ? (
    <div className="product-editor" style={{ overflow: "scroll" }}>
      <ProductCard 
        contentEditable 
        setEditingProcess={initiateProcessEdit} 
        stageToExpand={stageToExpand as number} 
        optionsFooter 
      />
      {
        showUnpublishWarning && (
        <UnpublishFirstPopup 
          visible={showUnpublishWarning} 
          close={() => setShowUnpublishWarning(false)}
         />
        )
      }
    </div>
  ) : <ProcessEditor editingProcess={editingProcess} onFinish={onFinishEdit} fetcher={fetcher}/>
});