import { memo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../table/DataTable";;
import { isObjectEmpty, fetchWithAuth } from "../../../utils/utils";
import "./UploadedFiles.css"
import { UploadedFile } from "./UploadedFile";
import { UploadedFile as UploadedFileType} from "./types";

export const UploadedFiles = memo(function UploadedFiles() {
  const [ files, setFiles ] = useState<UploadedFileType[] | []>([]);
  const nav = useNavigate();

  useEffect(() => {
    if (isObjectEmpty(files)) {
      fetchWithAuth(
        "saviors/files",
        { setState: ({ content }) => setFiles(content), method: "GET",}
      );
    }
  }, []);

  return (
      <DataTable 
        columns={["upload date", "filename", "size", "total CO2e calculation"]}
        title={"uploaded files"}
        className="files">
        {files?.map(file => {
          const { id } = file;
          return (
            <UploadedFile 
            key={id}
            date={file.date}
            // filename={file._id}
            // size={file.size}
            co2e={file.co2e}
            needsProcessing={file.needs_processing}
            onClick={() => nav(`./${id}`, {state: file.co2e})}
            />
          )
        })
        } 
      </DataTable>
  )
});