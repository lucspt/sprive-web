import { formatCO2e } from "../utils";


export default function CarbonDigit({ co2e }) {
  const [ digit, metric ] = formatCO2e(co2e);

  return (
    <div>
      <span className="info-digit digit">{digit}</span>
      <span className="info-metric metric">{metric}</span>
    </div>
  )
} 