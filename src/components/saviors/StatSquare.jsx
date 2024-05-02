import { formatCO2e } from "../../utils/utils";
import "./StatSquare.css"

export default function StatSquare({ title, digit, format=false }) {
  let metric;
  if (format) {
    ([ digit, metric ] = formatCO2e(digit, { stringify: false }));
  };

  return (
    <div className="square">
    <p>{ title }</p>
    <div className="number">
      <span className="digit">{ digit }</span>
      { metric && <span className="metric">{ metric }</span> }
    </div>
  </div>
  )
}