import { BaseInput } from "../../inputs/base/BaseInput";
import { SideModal } from "../../modals/SideModal";

export default function ModalForm({ visible, close, }) {

  return (
    <SideModal visible={visible} close={close} titleText="Contact a supplier">
      <div className="contact-form">
        <div className="field">
        <BaseInput className="rounded-input" label="Email"/>
        </div>
      </div>
    </SideModal>

  )
}