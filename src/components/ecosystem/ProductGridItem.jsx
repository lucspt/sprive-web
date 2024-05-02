import { formatCO2e} from "../../utils/utils";

export default function ProductGridItem ({
  name, 
  onClick,
  co2e, 
  rating="B" 
}) {
  return (
    <div className="item" tabIndex={0} onClick={onClick}>
      <div className="heading">
        <span>{name}</span>
        <span className={`rating ${rating}`}>{rating}</span>
      </div>
      <div className="infos">
      <div className="info">
        <span style={{ alignSelf: "flex-start" }}>CO2e:</span>
        <span>{formatCO2e(co2e).join(" ")}</span>
      </div>
      </div>
    </div>
  )
};