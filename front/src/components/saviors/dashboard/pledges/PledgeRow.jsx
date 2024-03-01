import { memo } from "react"
import { formatCO2e } from "../../../../utils"

const PledgeRow = memo(({ pledge, onClick }) => {
  
  let { impact_level: indicator, name, co2e } = pledge;
  indicator = indicator || ["good", "normal", "great"][~~(Math.random() * 3)];

  return (
    <div 
      className="row"
      tabIndex={0}
      onClick={onClick}
    > 
      <span>{name}</span>
      <span className={`indication ${indicator}`}>{indicator}</span>
      <span>{formatCO2e(co2e).join(" ")}</span>
      <span className="align-end">{pledge.status || "active"}</span>
      <span className="material-symbols-rounded align-end flip pink-hov">equalizer</span>
    </div>
  )
})

export default PledgeRow