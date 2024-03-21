import { formatCO2e } from "../../utils"

export default function PledgeGridItem ({ 
  name, 
  co2e, 
  started, 
  onClick, 
  className 
}) {
  const [ digit, metric ] = formatCO2e(co2e);

  return (
    <div 
      className={`item${className}`}
      tabIndex={0} 
      onClick={onClick}
    >
      <div className="heading">
        <span>{name}</span>
      </div>
      <div className="stat">
      <span>
        <span className="digit">{digit}</span> {metric}
      </span>
      </div>
      <div className="info">
        <span>{started}</span>
      </div>
    </div>
  )
};