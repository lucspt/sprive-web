import { memo } from "react"
import { formatCO2e } from "../../../utils/utils"
import { useLoaderData, useNavigate } from "react-router-dom"
import { DataTable } from "../../table/DataTable";;
import "./FileLogs.css";
import { FileLog } from "./FileLog";
import { Header } from "../../header/Header";
import { FileViewerLoaderResponse } from "./types";

export const FileLogs = memo(function FileViewer() {
const { fileLogs, fileName } = useLoaderData() as FileViewerLoaderResponse;
const nav = useNavigate();

return (
  <div className="file-viewer page">
    <div className="content">
    <span 
      className="material-symbols-rounded white-hov back"
      tabIndex={0}
      onClick={() => nav(-1)}
      >
        arrow_back</span>
      <div className="info">
        <Header text={fileName} fontSize="lg" />
        <span style={{marginBottom: 7}}>total CO₂e: {formatCO2e(
          fileLogs.reduce((co2e, current) => current.co2e + co2e || 0, 0)
        )}</span>
        <span>total rows: {fileLogs.length}</span>
        <span>rows awaiting processing: {fileLogs.filter(x => x.processed === false).length}</span>
      </div>
    <DataTable 
      columns={["activity", "value", "unit", "unit type", "CO₂e"]}
      className="file-logs"
      >
        {
          fileLogs.map(row => (
            <FileLog
              key={row._id}
              unit={row.unit}
              value={row.value}
              unitType={row.unit_type}
              isProcessed={row.processed}
              activity={row.activity}
              co2e={row.co2e}
            />
          ))
      }
    </DataTable>
    </div>
    {!fileLogs.every(x => x.processed === true) && 
      <div className="bottom">
      <button 
        className="default-btn" style={{ height: 35}}
        onClick={
          () => nav(
            "../../factors",
            {replace: true, state: {"processFile": fileName}}
          )
        }
        >
        calculate emissions
      </button>
      </div>
    }
  </div>
  )
});