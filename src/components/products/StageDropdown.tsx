import { useState } from "react";
import { formatCO2e } from "../../utils/utils";
import "./StageDropdown.css";
import Rating from "./Rating";
import DropdownProcess from "./DropdownProcess";
import { 
  STAGE_HEIGHT_DELAY,
  STAGE_HEIGHT_DURATION,
  STAGE_OPACITY_DELAY,
  STAGE_OPACITY_DURATION,
  PROCESS_HEIGHT,
  STAGE_ICONS, 
  STAGE_DROPDOWN_ITEM_GAP,
} from "./constants";
import { StageDropdownProps } from "./types";
import { ProductProcess, ProductStageName } from "../saviors/products/types";


export default function StageDropdown({ 
  co2e, 
  name, 
  processes, 
  percentage, 
  productRating,
  setEditingProcess,
  productId,
  shouldExpand,
}: StageDropdownProps) { 

  const numProcesses = processes.length
  const [ expanded, setExpanded ] = useState(shouldExpand);
  const targetHeight = numProcesses > 0 ? (PROCESS_HEIGHT + STAGE_DROPDOWN_ITEM_GAP) * (numProcesses + 1) : 0;

  const processesStyle = {
    gap: STAGE_DROPDOWN_ITEM_GAP, 
    ...expanded
    ? { 
      height: targetHeight,
      opacity: 1 ,
      transition: `opacity ${STAGE_OPACITY_DURATION}s ease, height ${STAGE_HEIGHT_DURATION}s ease`,
      }
    : { 
      height: 0, 
      opacity: 0,
      transition: `opacity ${STAGE_OPACITY_DURATION}s linear ${STAGE_OPACITY_DELAY}s, height ${STAGE_HEIGHT_DURATION}s ease ${STAGE_HEIGHT_DELAY}s`,
    },
    animation: "none"
  }

  const lastIndex = numProcesses - 1;

  const initProcessCreation = () => {
    setEditingProcess({ 
      co2e: "N/A", 
      stageName: (name as ProductStageName), 
      method: "POST", 
    });
  };
  
  const initProcessEdit = (p: ProductProcess) => {
    setEditingProcess({ 
      ...p, 
      stageName: (name as ProductStageName), 
      productId, 
      method: "PUT", 
    });
  };

  return (
    <div className="ecosystem-stage">
      <button 
        className="dropdown-row stage-dropdown" 
        style={{ overflow: "hidden" }}
        onClick={() => setExpanded(prev => !prev)} 
      >
        <Rating rating={productRating || "good"} size={42} showText={false}>
          <span className="material-symbols-rounded filled stage-icon">{ STAGE_ICONS[name as ProductStageName] }</span>
        </Rating>
        <div className="details">
          <span>{ name }</span>
          <div style={{ gap: 17, display: "flex" }}>
          <div className="emissions">
            {
              co2e ?
            <>
              <span>{formatCO2e(co2e, { stringify: true })}</span>
              <span className="percentage">{ percentage }%</span>
            </> 
            : <span>N/A</span>
            }
          </div>
          <div className={`expand-more${expanded ? " flip" : ""}`}>
            <span className={`material-symbols-rounded`}>expand_more</span>
          </div>
          </div>
        </div>
      </button>
      <div className="add-process" style={{ display: expanded ? "flex" : "none"}}>
      <button className="white-hov" onClick={initProcessCreation}>
        <span className="material-symbols-rounded white-hov">add</span>
      </button>
      </div>
        <div className="processes" 
          style={processesStyle}
        >
          {processes?.map((p, i) => (
            <DropdownProcess 
              name={p.process} 
              co2e={p.co2e as number} 
              // processId={p._id}
              // stageName={name}
              key={p._id}
              numProcesses={lastIndex}
              index={i + 1}
              productRating={productRating}
              expanded={expanded}
              isLast={i === lastIndex}
              edit={() => initProcessEdit(p)}
            />
            )
          )}
        </div>
    </div>
  )
}