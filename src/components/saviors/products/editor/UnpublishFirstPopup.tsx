import { Modal } from "../../../modals/Modal";
import { UnpublishFirstPopupProps } from "./types";

export function UnpublishFirstPopup({ close, children, visible }: UnpublishFirstPopupProps) {

  return (
    <Modal
    showClose
    visible={visible} 
    close={close}
    small
    className="warning-modal"
  >
    <div className="warning-container">
      <p>
        You must first unpublish this product before editing
      </p>
      { children }
    </div>
  </Modal>
  )
}