import { formatCO2e } from "../../../../utils"
import { toggleRowDropdown } from "../../../DataTable"
import { memo } from "react"

const Row = memo(({ rowData }) => {

  return (
    <div className="row-wrapper white-hov"
      onClick={toggleRowDropdown}>
      <div className="row">
        <span>{rowData.name}</span>
        <span>{rowData.category}</span>
        <span>{rowData.activity}</span>
        <span>{rowData.value}</span>
        <span>{rowData.unit}</span>
        <span className="align-end">{formatCO2e(rowData.co2e).join(" ")}</span>
        <span className="material-symbols-rounded align-end flip">
          expand_more
        </span>
      </div>
      <div className="dropdown">
        <div className="insights">
          <div className="info">
            <span>data source:</span>
            <span>{rowData.source_file.name}</span>
          </div>
          <div className="info">
            <span>factor source:</span>
            <span>{rowData.factor_source || "ecoinvent"}</span>
          </div>
        </div>
        <div className="traceback">
          <span>CO2e calculation:</span>
          <div className="calculation">
            <span>formula: value X factor = CO2e</span>
            <span>{rowData.value} X {rowData.co2e / rowData.value} = {rowData.co2e}</span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default Row