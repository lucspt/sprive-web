import { formatCO2e } from "../../../utils/utils";
import Checkbox from "../Checkbox";


export default function SupplierRow({ name, emissions, rank, priority, participation, toggleCheck }) {

  return (
    <div className="row">
      <Checkbox className="cell"/>
      <span className="cell">{ name }</span>
      <span>{ formatCO2e(emissions) }</span>
      <span>{ rank }</span>
      <span>{ priority }</span>
      <span className="align-end">{ participation }</span>
    </div>
  )
}