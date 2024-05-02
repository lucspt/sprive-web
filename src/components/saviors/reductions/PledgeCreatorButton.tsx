import { useState } from "react"
import { BaseInput } from "../../inputs/base/BaseInput";
import { SlideUpModal } from "../../modals/SlideUpModal";

/**
 * A button that will render a `<SlideUpModal/>`  with a form that handles
 * creating pledges .on click.
 * 
 * @returns A react component
 */
export function PledgeCreatorButton() {
  const [ showModal, setShowModal ] = useState<boolean>(false);

  return (
    <div className="create">
      <button className="default-btn" onClick={() => setShowModal(true)}>Create pledge</button>
      <SlideUpModal visible={showModal} close={() => setShowModal(false)} title="Create a pledge">
        <div className="pledge-creator">
          <form>
            <BaseInput
              name="name"
              type="text"
              label="Name"
              />
              <div className="base-input">
                <label htmlFor="description">Description</label>
                <textarea rows={3} name="description" id="description" />
              </div>
          </form>
        </div>
      </SlideUpModal>
    </div>
  )
}