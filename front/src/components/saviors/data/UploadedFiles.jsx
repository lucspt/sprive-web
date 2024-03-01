import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../DataTable";
import { isObjectEmpty, formatCO2e, fetchData } from "../../../utils";
import "./UploadedFiles.css"

const UploadedFiles = memo(function UploadedFiles() {
  const [ files, setFiles ] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    if (isObjectEmpty(files)) {
      fetchData("saviors/files", "GET", {}, {}, setFiles);
    }
  }, []);

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
            nav={() => nav(`./${file._id}`, {state: file.co2e})}
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
    <div className={`row${needsProcessing ? " needs-processing" : ""}`} onClick={nav}>
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

export default UploadedFiles