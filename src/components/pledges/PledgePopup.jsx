import { formatCO2e, isObjectEmpty } from "../../utils"
import "./PledgePopup.css";
import Modal from "../Modal";


const CO2eDigit = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e);
  return (
    <>
      <span className="digit">{digit}</span>
      <span className="metric">{metric}</span>   
     </>
  )
}
export default function PledgePopup({ pledge, exit }) {


  const recurringHover = () => {
    const { frequency_value } = pledge
    return `${frequency_value} ${frequency_value > 1 ? "times" : "time"} a week`
  } 
  
  return  (
    <Modal visible={!isObjectEmpty(pledge)} titleText={pledge.name} close={exit} className="pledge-popup">
      <div className="info">
        <span className="badge">
          <CO2eDigit co2e={pledge.co2e} />
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