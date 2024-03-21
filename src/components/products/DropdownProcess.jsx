import { Form, Link, useSearchParams } from "react-router-dom";
import { formatCO2e } from "../../utils";
import Rating from "../Rating";
import "./DropdownProcess.css"

const maxHeight = 60 / 2.5
const LINK_HEIGHT = 25 + maxHeight // gap + height
const cubicBezier = "cubic-bezier(0.4, 0, 1, 1)";

export default function DropdownProcess({ 
  name, 
  co2e, 
  productRating, 
  isLast, 
  expanded, 
  index,
  numProcesses,
  edit,
 }) {

  const delay = 0.25 * index;
  const linkStyle = {
    ...expanded ? {
      height: LINK_HEIGHT,
      transition: `height 0.25s ease-in ${delay}s`,
    } : {
      height: 0,
      transition: `height 0.3s ease-in`,
    }
}
  const badgeStyle =
  expanded ? { 
    transition: `transform 0.2s ${cubicBezier} ${0.15 * index}s`,
    transform: `scale(1)`
  } : {
    transition: `transform 0.2s ${cubicBezier} ${0.25 * (numProcesses - index)}s`,
    transform: "scale(0)"
  };

  productRating = "good";
  co2e = formatCO2e(co2e).join(" ");

  return (
    <>
      <div className="dropdown-row process" style={{maxHeight}}>
        <div style={{ position: "relative" }}>
      {!isLast && (
        <div className={`process-link rating-dot ${productRating}`} style={linkStyle}/>
      )}
        <Rating size={20} rating={productRating || "good"} style={badgeStyle}/>
        </div>
        <div className="details">
          <span>{ name }</span>
          {edit
            ? (
              <div style={{ display: "flex", gap: 25, alignItems: "center" }}>
                <span>{ co2e }</span>
                <button 
                  style={{cursor: "pointer"}} 
                  className="white-hov"
                  onClick={edit}
                >
                  <span className="material-symbols-rounded">build</span>
                </button>
              </div>
            ) : <span>{ co2e }</span>
          }
        </div>
      </div>
    </>
  )
}