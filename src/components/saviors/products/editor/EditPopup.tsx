import { useState } from "react";
import { Modal } from "../../../modals/Modal";
import "./EditPopup.css";
import { fetchWithAuth } from "../../../../utils/utils";
import { BaseInput } from "../../../inputs/base/BaseInput";
import { UnpublishFirstPopup } from "./UnpublishFirstPopup";
import { EditPopupProps } from "./types";

export default function EditPopup({ 
  isVisible, 
  isPublished, 
  close,
  productName,
  productId,
  setProductName,
 }: EditPopupProps) {
  const [ name, setName ] = useState(productName);
  const [ loading, setLoading] = useState(false);
  const [ error, setError ] = useState("");

  const onSave = async () => {
    if (name !== productName) {
      setLoading(true)
      const res = await fetchWithAuth(
        `saviors/products/${productId}`, 
        { body: { name }, method: "PATCH" }
      )
      if ((res as Response).status === 409) {
        setError("A product with that name has already been created");
      } 
      setLoading(false);
      setProductName(name);
      close();
    } else close();
  }

  return isPublished ? (
    <UnpublishFirstPopup visible={isVisible} close={close} />
  )
  : (
    <Modal visible={isVisible} close={close} titleText="Edit" titleSize="med">
      <div className="edit-popup">
        {loading ?
          <div className="loading">loading...</div>
          : <>
            <div className="full-space">
            <BaseInput
              className="edit-field"
              type="text"
              name="name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Product name"
              />
              <div className="error" style={{ paddingTop: 10 }}>
              <span style={{ color: "var(--eco-danger)"}}>{ error }</span>
            </div>
            </div>
            <div className="save" onClick={onSave}>
              <button className="default-btn">save</button>
            </div>
          </>
    }
      </div>
      </Modal>  
  )
}