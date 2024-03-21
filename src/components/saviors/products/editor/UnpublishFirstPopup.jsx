import Modal from "../../../Modal";


export default function UnpublishFirstPopup({ close, children, visible }) {

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