import { useState } from "react";
import { fetchWithAuth, formatCO2e } from "../../../utils/utils";
import { Modal } from "../../modals/Modal";
import "./PublishPopup.css"
import { PublishPopupProps } from "./types";
import { OnClickFn } from "../../../types";

export function PublishPopup({ 
  showPopup, 
  close, 
  productName, 
  co2e, 
  productId,
  setPublished,
  isPublished,
}: PublishPopupProps) {
  const [ loading, setLoading ] = useState(false);

  async function publish() {
    setLoading(true);
    await fetchWithAuth(
      "saviors/published-products", {
        body: { product_id: productId },
        method: "POST",
      }
    );
    setLoading(false);
    setPublished(true);
    (close as Function)();
  }

  async function unpublish() {
    setLoading(true);
    await fetchWithAuth(
      `saviors/published-products/${productId}`, { method: "DELETE"}
    );
    setLoading(false);
    setPublished(false);
    (close as Function)();
  }
  

  return isPublished ? (
    <Modal 
      className="unpublish-popup"
      visible={showPopup}
      titleText="Unpublish your product"
      close={close as OnClickFn}
      small
      titleSize="sm"
      showClose={false}
    >

      {
        loading ? <div className="loading">loading...</div>
        : <>
          <span>Are you sure you want to unpublish this product?</span>
        <div className="options">
          <button onClick={unpublish} style={{ color: "var(--eco-danger)"}}>Yes</button>
          <button
            onClick={close as OnClickFn}
            style={{ borderBottomLeftRadius: 10, borderBottomRightRadius: 10}}
            >
            Cancel
          </button>
        </div>
          </>
        }
    </Modal>
  )
  : 
  (
    <Modal
      className="publish-popup"
      visible={showPopup} 
      titleText={isPublished ? "Unpublish your product" : `Publish your product`}
      close={close}
    >
      {loading ? <div className="loading">loading...</div>
      : <>
      <div className="publish-details">
        <div className="detail">
          <p>Name:</p>
          <span>{ productName }</span>
        </div>
        <div className="detail">
          <p>Emissions:</p>
          <span>{ formatCO2e(co2e) }</span>
        </div>
      </div>
      <div className="bottom button">
        <button className="default-btn" onClick={publish}>publish</button>
      </div>
    </>
    }
  </Modal>
  )
}