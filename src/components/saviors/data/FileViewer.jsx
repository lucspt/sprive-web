import { useEffect, useState, memo } from "react"
import { fetchData, formatCO2e } from "../../../utils"
import { useLoaderData, useNavigate } from "react-router-dom"
import DataTable from "../../DataTable";
import "./FileViewer.css";
import FileLog from "./FileLog";
import Header from "../../Header";

export const getFile = async ({ params }) => {
  const { tableId } = params;
  const res = await fetchData(`saviors/files/${tableId}`, "GET");
  return {fileLogs: res.content, filename: tableId};
}
 const FileViewer = memo(function FileViewer() {
  const { fileLogs, filename } = useLoaderData();
  const nav = useNavigate();
  console.log(fileLogs);

  return (
    <div className="file-viewer">
      <div className="content">
      <span 
        className="material-symbols-rounded white-hov back"
        tabIndex={0}
        onClick={() => nav(-1)}
        >
          arrow_back</span>
        <div className="info">
          <Header text={filename} fontSize="large" />
          <span style={{marginBottom: 7}}>total CO2e: {formatCO2e(
            fileLogs.reduce((co2e, current) => current.co2e + co2e || 0, 0)
          ).join(" ")}</span>
          <span>total rows: {fileLogs.length}</span>
          <span>rows awaiting processing: {fileLogs.filter(x => x.processed === false).length}</span>
        </div>
      <DataTable 
        columns={["name", "value", "unit", "unit type", "activity", "co2e"]}
        className="file-logs"
        >
          {
            fileLogs.map(row => (
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
              {replace: true, state: {"processFile": filename}}
            )
          }
          >
          calculate emissions
        </button>
        </div>
      }
    </div>
    )
})

export default FileViewer