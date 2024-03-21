import { useState } from "react"
import { formatCO2e } from "../../../utils"

const SupplierWidget = ({ 
  name, 
  grade, 
  spend, 
  emissions, 
  category, 
  select, 
  id
}) => {

  const [ selected, setSelected ] = useState(false);
  const [ hover, setHover ] = useState(false);

  return name && (
    <div 
      className={`showcase-widget ${selected}${hover ? " hover" : ""}`}
      tabIndex={0} 
      onClick={() =>{setHover(false); select(selected, setSelected, id)}}
      onMouseEnter={() => selected && setHover(true)}
      onMouseLeave={() => selected && setHover(false)}
    >
      <div className="heading">
        <span className="info">
          {name}
          {selected && 
            <span className="selected">
              {hover ? "x" : ""}
            </span>
          }
        </span>
        <div className="info">
          <span style={{ display: "inline" }} className={`rating ${grade}`}>{grade || "N/A"}</span>
          <span style={{fontSize: "0.8em"}}>grade</span>
        </div>
      </div>
      <div className="infos">
        <div className="info">
          <span>spend:</span>
          <span>{spend}</span>
        </div>
        <div className="info">
          <span>emissions:</span>
          <span>{emissions ? formatCO2e(emissions).join(" ") : "N/A"}</span>
        </div>
        <div className="info">
          <span>category:</span>
          <span>{category}</span>
        </div>
      </div>
    </div>
  )
}

export default SupplierWidget
