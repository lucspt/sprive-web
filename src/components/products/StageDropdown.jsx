import { useState } from "react";
import { formatCO2e } from "../../utils";
import "./StageDropdown.css";
import Rating from "../Rating";
import DropdownProcess from "./DropdownProcess";
import { useEffect } from "react";

export const STAGE_ICONS = {
  "sourcing": "account_tree",
  "processing": "rebase",
  "assembly": "construction",
  "transport": "local_shipping"
};

const WRAPPER_HEIGHT = 60;
const PROCESS_HEIGHT = WRAPPER_HEIGHT / 2.5;
const ITEM_GAP = 25;
const OPACITY_DURATION = .25;
const HEIGHT_DURATION = .4;
const HEIGHT_DELAY = 0.25;
const OPACITY_DELAY = 0.1

export default function StageDropdown({ 
  co2e, 
  name, 
  processes, 
  percentage, 
  productRating,
  setEditingProcess,
  productId
}) { 

  const numProcesses = processes.length
  const [ expanded, setExpanded ] = useState(false);
  const targetHeight = numProcesses > 0 ? (PROCESS_HEIGHT + ITEM_GAP) * (numProcesses + 1) : 0;

  const processesStyle = {
    gap: ITEM_GAP, 
    ...expanded
    ? { 
      height: targetHeight,
      opacity: 1 ,
      transition: `opacity ${OPACITY_DURATION}s ease, height ${HEIGHT_DURATION}s ease`,
      }
    : { 
      height: 0, 
      opacity: 0,
      transition: `opacity ${OPACITY_DURATION}s linear ${OPACITY_DELAY}s, height ${HEIGHT_DURATION}s ease ${HEIGHT_DELAY}s`,
    },
    animation: "none"
  }

  const lastIndex = numProcesses - 1;

  const initProcessCreation = () => {
    setEditingProcess({ co2e: "N/A", stageName: name, method: "POST" });
  };
  
  const initProcessEdit = (p) => {
    setEditingProcess({ ...p, stageName: name, productId, method: "PUT" });
  };

  return (
    <div className="ecosystem-stage">
      <button 
        className="dropdown-row stage-dropdown" 
        style={{ overflow: "hidden" }}
        onClick={() => setExpanded(prev => !prev)} 
      >
        <Rating rating={productRating || "good"} size={42} showText={false}>
          <span className="material-symbols-rounded filled stage-icon">{ STAGE_ICONS[name] }</span>
        </Rating>
        <div className="details">
          <span>{ name }</span>
          <div style={{ gap: 17, display: "flex" }}>
          <div className="emissions">
            {
              co2e ?
            <>
              <span>{formatCO2e(co2e).join(" ")}</span>
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
              co2e={p.co2e} 
              processId={p._id}
              stageName={name}
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