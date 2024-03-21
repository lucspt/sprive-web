import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../DataTable";
import { isObjectEmpty, formatCO2e, fetchData } from "../../../utils";
import "./UploadedFiles.css"
import UploadedFile from "./UploadedFile";

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

export default UploadedFiles