import { useEffect, useState, memo } from "react"
import { fetchData, formatCO2e, isObjectEmpty } from "../../../utils"
import { useLoaderData, useLocation, useNavigate } from "react-router-dom"
import DataTable from "../../DataTable"

export const FileViewer = memo(function SaviorData() {
  const tableId = useLoaderData()
  const nav = useNavigate()
  const [ tableData, setTableData ] = useState([])

  useEffect(() => {
    if (tableId && !tableData.length) {
      fetchData(`saviors/files/${tableId}`, "GET", {}, {}, setTableData)
    }

  }, [tableId])

  console.log(tableData)
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
        tableData.map(row => 
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
          )
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

export const UploadedFiles = memo(function UploadedFiles() {
  const [ files, setFiles ] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    if (isObjectEmpty(files)) {
      fetchData("saviors/files", "GET", {}, {}, setFiles)
    }
  }, [])

  useEffect(() => console.log(files, "files"), [files])

  return (
      <DataTable 
        columns={["upload date", "filename", "size", "total CO2e calculation"]}
        title={"uploaded files"}
        className="files">
        {files?.map(file => (
          <UploadedFile 
            key={file._id}
            date={file.date}
            filename={file._id}
            size={file.size}
            co2e={file.co2e}
            needsProcessing={file.needs_processing}
            nav={nav}
          />
          ))
        } 
      </DataTable>
  )
})

const UploadedFile = ({ date, filename, size, co2e, needsProcessing, nav }) => {
  const uploadDate = new Date(date).toLocaleDateString(
    undefined, {month: "2-digit", year: "2-digit"}
  )

  return (
    <div className={`row${needsProcessing ? " needs-processing" : ""}`} onClick={() => nav(`./${filename}`, {state: co2e})}>
      <span>{uploadDate}</span>
      <span>{filename || "fname"}</span>
      <span>{size || "50 KB"}</span>
      <span className="align-end">{formatCO2e(co2e).join(" ")}</span>
      {needsProcessing && 
      <>
          <span 
          className="material-symbols-rounded processing-notice align-end"
          >
            report
        </span>
        <span className="hover">this file is awaiting CO2e calculations</span>
      </>
      }
    </div>
  )
}