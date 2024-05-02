import { formatCO2e, isObjectEmpty } from "../../utils/utils"
import "./PledgePopup.css";
import { Modal } from "../modals/Modal";

export default function PledgePopup({ pledge, exit }) {


  const recurringHover = () => {
    const { frequency_value } = pledge
    return `${frequency_value} ${frequency_value > 1 ? "times" : "time"} a week`
  } 
  
  const [ digit, metric ] = formatCO2e(co2e);


  return  (
    <Modal visible={!isObjectEmpty(pledge)} titleText={pledge.name} close={exit} className="pledge-popup">
      <div className="info">
        <span className="badge">
          <span className="digit">{digit}</span>
          <span className="metric">{metric}</span> 
        </span>
        <p>{pledge.description || "this is a pledge card, here will be a description of the pledge one made"}</p>
      </div>
      <div className="footer">
        {
          pledge.recurring && 
          <div className="recurring-pledge">
            <span className="notice">this is a recurring pledge 
            <span style={{ color: "var(--eco-great)" }}>*</span>
            </span>
            <span className="hover">
              this pledge will have an effect {recurringHover()}
            </span>
          </div>
        }
      </div>
    </Modal>
  )
}