import { memo, useState } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom";
import { fetchData, isObjectEmpty } from "../../../../utils";
import ProductCard from "../../../products/ProductCard";
import ProcessEditor from "./ProcessEditor";
import UnpublishFirstPopup from "./UnpublishFirstPopup";

export const loadProductForPartner = async ({ params }) => {
  const productId = params.productId;
  const res = await fetchData(`saviors/products/${productId}`, "GET");
  return res.content;
}

const EditableProductCard = memo(function EditableProductCard() {
  const [ editingProcess, setEditingProcess ] = useState({});
  const product = useLoaderData();
  const [ showUnpublishWarning, setShowUnpublishWarning ] = useState(false);

  const onFinishEdit = () => {
    setEditingProcess({});
  };

  const initiateProcessEdit = () => {
    product.published 
      ? setShowUnpublishWarning(true)
      : setEditingProcess({})
  }


  const fetcher = useFetcher();
  return isObjectEmpty(editingProcess) ? (
    <div className="product-editor" style={{ overflow: "scroll" }}>
      <ProductCard contentEditable setEditingProcess={initiateProcessEdit} optionsFooter />
      {
        showUnpublishWarning && (
        <UnpublishFirstPopup 
          visible={showUnpublishWarning} 
          close={() => setShowUnpublishWarning(false)}
          message=""
         />
        )
      }
    </div>
  ) : <ProcessEditor editingProcess={editingProcess} onFinish={onFinishEdit} fetcher={fetcher}/>
});

export default EditableProductCard