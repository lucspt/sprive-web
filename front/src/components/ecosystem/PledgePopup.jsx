import {  useEffect, useRef } from "react"
import { fetchData, formatCO2e, isObjectEmpty } from "../../utils"
import Star from "./Star"


const CO2eDigit = ({ co2e }) => {
  const [ digit, metric ] = formatCO2e(co2e)
  return (
    <>
      <span className="digit">{digit}</span>
      <span>{metric}</span>   
     </>
  )
}
export default function PledgePopup({ pledge, exit }) {
  const popupRef = useRef();


  const recurringHover = () => {
    const { frequency_value } = pledge
    return `${frequency_value} ${frequency_value > 1 ? "times" : "time"} a week`
  } 

  console.log(pledge)
  

  const { _id } = pledge
  return !isObjectEmpty(pledge) && (
    <div ref={popupRef} className="pledge-popup popup-card" >
      <header className="heading">
        <span>{pledge.name}</span>
        <button onClick={exit}>
          <span className="material-symbols-rounded white-hov">close</span>
        </button>
      </header>
      <div className="info">
        <span className="badge">
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
          <CO2eDigit co2e={pledge.co2e} />
        </span>
        <p>{pledge.description || "this is a pledge card, here will be a description of the pledge one made"}</p>
      </div>
      <div className="footer">
        <div className="left">
        </div>
        <div className="right">
          <Star resourceId={_id} stars={pledge.stars} action={`.?resource=${_id}`}/>
        </div>
      </div>
    </div>
  )
}