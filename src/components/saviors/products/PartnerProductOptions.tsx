import { useState } from "react";
import { Modal } from "../../modals/Modal";
import OptionsFooter from "./editor/OptionsFooter";
import { PublishPopup } from "./PublishPopup";
import EditPopup from "./editor/EditPopup";
import { PartnerProductOptionsProps } from "./editor/types";

export default function PartnerProductOptions({ product, setName }: PartnerProductOptionsProps) {
  const { name, product_id, co2e, stages, published } = product;
  const [ _published, setPublished ] = useState(published);
  const [ showPublishPopup, setShowPublishPopup ] = useState(false);
  const [ cantPublishWarning, setCantPublishWarning ] = useState<[]|string[]>([]);
  const [ showEditPopup, setShowEditPopup ] = useState(false);
  
  // const publishInfo = {
  //   unit_types,
  //   activity: name,
  //   product_id,
  //   co2e: co2e, 
  // }

  return (
    <>
      <OptionsFooter 
        stages={stages}  
        isPublished={_published}
        showPublishPopup={() => setShowPublishPopup(true)}
        setWarn={setCantPublishWarning}
        showEditPopup={() => setShowEditPopup(true)}
        />
      <PublishPopup
        showPopup={showPublishPopup}
        productId={product_id} 
        close={() => setShowPublishPopup(false)}
        productName={name}
        isPublished={_published}
        setPublished={setPublished}
        co2e={co2e}
        />
        <EditPopup 
          setProductName={setName}
          isVisible={showEditPopup} 
          close={() => setShowEditPopup(false)}
          productName={name}
          isPublished={_published}
          productId={product_id}
         />
      { cantPublishWarning && 
          <Modal
            showClose
            visible={cantPublishWarning.length > 0} 
            close={() => setCantPublishWarning([])}
            small
            className="warning-modal"
          >
            <div className="warning-container">
              <p>
              You must fill all emissions stages before publishing this product
              </p>
              <span style={{textWrap: "wrap", padding: "0px 20px", lineHeight: 2}}>
              The following are missing data: 
              <span style={{display: "block"}}> {cantPublishWarning.join(", ")}</span>
              </span>
            </div>
          </Modal>
      }
    </>
  )
}