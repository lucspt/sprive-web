import { formatCO2e } from "../../../utils"
import { useState } from "react"

const SupplierRow = ({ 
  name, grade, spend, emissions, category, select, id
}) => {
  const [ selected, setSelected ] = useState(false);

return name && (
    <div
      className={`row ${selected}`}
      tabIndex={0}
      onClick={() => select(selected, setSelected, id)}
      onMouseEnter={e => {selected  ? e.target.firstChild.innerText = "cancel" : null}}
      onMouseLeave={e => {selected ? e.target.firstChild.innerText = "check_circle" : null}}


    >
      {selected ? 
        <span 
          className="material-symbols-rounded filled"
          style={{ color: "var(--calm-blue)", cursor: "pointer" }}
        >
          check_circle
        </span>
        :
        <span 
          style={{cursor: "pointer"}} 
          className="material-symbols-rounded"
        >
          circle
        </span>
      }
      <span>{name}</span>
      <span className={`indication ${grade}`}>{grade || "N/A"}</span>
      <span>{spend}</span>
      <span style={{paddingLeft: 5}}>{emissions ? formatCO2e(emissions).join(" ") : "N/A"}</span>
      <span className="align-end">{category}</span>
    </div>
  )
}

export default SupplierRow