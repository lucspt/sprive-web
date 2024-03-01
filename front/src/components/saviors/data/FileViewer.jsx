import { useEffect, useState, memo } from "react"
import { fetchData, formatCO2e } from "../../../utils"
import { useLoaderData, useNavigate } from "react-router-dom"
import DataTable from "../../DataTable";
import "./FileViewer.css";

 const FileViewer = memo(function SaviorData() {
  const tableId = useLoaderData();
  const nav = useNavigate();
  const [ tableData, setTableData ] = useState([]);

  useEffect(() => {
    if (tableId && !tableData.length) {
      fetchData(`saviors/files/${tableId}`, "GET", {}, {}, setTableData);
    }

  }, [tableId])

  return (
    <div className="file-viewer">
      <div className="content">
      <span 
        className="material-symbols-rounded white-hov back"
        tabIndex={0}
        onClick={() => nav(-1)}
        >
          arrow_back</span>
        <div className="info" style={{padding: "40px 20px 0px 80px"}}>
          <span style={{marginBottom: 7}}>total CO2e: {formatCO2e(
            tableData.reduce((co2e, current) => current.co2e + co2e || 0, 0)
          ).join(" ")}</span>
          <span>total rows: {tableData.length}</span>
          <span>rows awaiting processing: {tableData.filter(x => x.processed === false).length}</span>
        </div>
      <DataTable 
        columns={["name", "value", "unit", "unit type", "activity", "co2e"]}
        className="file-logs"
        >
        { tableData.length ?
        tableData.map(row => (
          <FileLog 
            key={row._id}
            name={row.name}
            unit={row.unit}
            value={row.value}
            unit_type={row.unit_type}
            isProcessed={row.processed}
            activity={row.activity}
            co2e={row.co2e}
          />
          ))
          : <span>this file has</span>}
      </DataTable>
      </div>
      <div className="bottom">
      <button 
        disabled={tableData.every(x => x.processed === true)}
        className="default-btn" style={{ height: 35}}
        onClick={() => nav("../../factors", {state: {"processFile": tableId}})}
      >
        calculate emissions
      </button>
      </div>
    </div>
    )
})

const FileLog = ({ 
  value,
  name,
  unit,
  unit_type,
  isProcessed,
  activity = "",
  co2e = ""
}) => {  
  return (
    <div className={`row file-log processed-${isProcessed}`}> 
      <span>{name}</span>
      <span>{value}</span>
      <span>{unit}</span>
      <span>{unit_type}</span>
      <span>{activity}</span>
      { co2e
          ? <span className="align-end">{formatCO2e(co2e).join(" ")}</span>
          : <span className="align-end" style={{ color: "var(--eco-danger)"}}>awaiting</span>
      }
    </div>
  )
}

export default FileViewer