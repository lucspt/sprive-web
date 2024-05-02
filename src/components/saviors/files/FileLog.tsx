import { formatCO2e } from "../../../utils/utils";
import { FileLogProps } from "./types";

export function FileLog({ 
  value,
  unit,
  unitType,
  isProcessed,
  activity,
  co2e,
}: FileLogProps){  
  
  return (
    <div className={`row file-log processed-${isProcessed}`}> 
      <span>{activity}</span>
      <span>{value}</span>
      <span>{unit}</span>
      <span>{unitType}</span>
      { co2e && typeof co2e === "number"
          ? <span className="align-end">{formatCO2e(co2e)}</span>
          : <span className="align-end" style={{ color: "var(--eco-danger)"}}>awaiting</span>
      }
    </div>
  )
}