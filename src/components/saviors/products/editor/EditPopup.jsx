import { useState } from "react";
import Modal from "../../../Modal";
import "./EditPopup.css";
import { fetchData } from "../../../../utils";
import TextInput from "../../../TextInput";
import UnpublishFirstPopup from "./UnpublishFirstPopup";

export default function EditPopup({ 
  isVisible, 
  isPublished, 
  close,
  productName,
  productId,
  setProductName,
 }) {
  const [ name, setName ] = useState(productName);
  const [ loading, setLoading] = useState(false);
  const [ error, setError ] = useState("");

  const onSave = async () => {
    if (name !== productName) {
      setLoading(true)
      await fetchData(
        `products/${productId}`, "PATCH", { name },
        {}, null, 409, () => setError("A product with that name has already been created")
      )
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
            <TextInput
              className="edit-field"
              name="name" 
              value={name}
              onChange={setName}
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