import { formatCO2e } from "../utils";

export const CardWidget = ({ title, infoDigit, infoMetric, style, co2e }) => {
  
  let digit, metric;
  if (co2e) {
    ([ digit, metric ] = formatCO2e(co2e));
  } else {
    digit = infoDigit;
    metric = infoMetric;
  }

  return (
    <div className="info-widget widget square">
      <span>{title}</span>
      <div className="widget-info" style={style}>
        <span className="info-digit">{digit}</span>  
        <span className="info-metric">{metric}</span>
      </div>
    </div>
  )
}