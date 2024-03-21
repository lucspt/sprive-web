import { formatCO2e } from "../../../utils";

export default function FileLog({ 
  value,
  name,
  unit,
  unit_type,
  isProcessed,
  activity = "",
  co2e = ""
}) {  
  return (
    <div className={`row file-log processed-${isProcessed}`}> 
      <span>{name}</span>
      <span>{value}</span>
      <span>{unit}</span>
      <span>{unit_type}</span>
      <span>{activity}</span>
      { typeof co2e === "number" 
          ? <span className="align-end">{formatCO2e(co2e).join(" ")}</span>
          : <span className="align-end" style={{ color: "var(--eco-danger)"}}>awaiting</span>
      }
    </div>
  )
}