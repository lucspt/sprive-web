import { formatCO2e } from "../../utils/utils";
import Rating from "../products/Rating";
import "./DropdownProcess.css"
import { DropdownProcessProps } from "./types";

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
 }: DropdownProcessProps) {

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
  const formattedCo2e = formatCO2e(co2e, { stringify: true });

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
                <span>{ formattedCo2e }</span>
                <button 
                  style={{cursor: "pointer"}} 
                  className="white-hov"
                  onClick={() => edit()}
                >
                  <span className="material-symbols-rounded" data-testid="edit-process-btn">build</span>
                </button>
              </div>
            ) : <span>{ formattedCo2e }</span>
          }
        </div>
      </div>
    </>
  )
}