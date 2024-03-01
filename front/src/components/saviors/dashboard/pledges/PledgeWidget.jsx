import { formatCO2e } from "../../../../utils";

export default function PledgeWidget({ pledge, onClick }) {
  let { impact_level } = pledge;
   impact_level = impact_level || ["good", "normal", "great"][~~(Math.random() * 3)];

  return (
    <div className="showcase-widget" 
    tabIndex={1} onClick={onClick}
    >
      <div className="title description">
        <span style={{fontSize: "1.12em"}} className="label">{pledge.name}</span>
        <span className={`indication ${impact_level}`}></span>
      </div>
      <div className="pledge-info">
        <div className="info-columns">
          <span>CO2e reduction:</span>
          <span>{formatCO2e(pledge.co2e_factor).join(" ")}</span>
        </div>
        <div className="info-columns">
          <span>total CO2e:</span>
          <span>{formatCO2e(pledge.co2e).join(" ")}</span>
        </div>
        <div className="reflection"></div>
      </div>
    </div>
  )
}
