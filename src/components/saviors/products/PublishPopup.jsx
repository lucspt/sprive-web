import { useState } from "react";
import { fetchData, formatCO2e } from "../../../utils";
import Modal from "../../Modal";
import "./PublishPopup.css"

export default function PublishPopup({ 
  showPopup, 
  close, 
  productName, 
  co2e, 
  productId,
  setPublished,
  isPublished,
}) {
  const [ loading, setLoading ] = useState(false);

  async function publish() {
    setLoading(true);
    await fetchData("saviors/published-products", "POST", {product_id: productId});
    setLoading(false);
    setPublished(true);
    close();
  }

  async function unpublish() {
    setLoading(true);
    await fetchData(`saviors/published-products/${productId}`, "DELETE");
    setLoading(false);
    setPublished(false);
    close();
  }
  

  return isPublished ? (
    <Modal 
      className="unpublish-popup"
      visible={showPopup}
      titleText="Unpublish your product"
      close={close}
      small
      titleSize="small"
      showClose={false}
    >

      {
        loading ? <div className="loading">loading...</div>
        : <>
          <span>Are you sure you want to unpublish this product?</span>
        <div className="options">
          <button onClick={unpublish} style={{ color: "var(--eco-danger)"}}>Yes</button>
          <button
            onClick={close}
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
          <span>{ formatCO2e(co2e).join(" ") }</span>
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