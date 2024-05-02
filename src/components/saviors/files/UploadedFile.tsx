import { formatCO2e } from "../../../utils/utils";
import { UploadedFileProps } from "./types";

export function UploadedFile({ 
  co2e,
  needsProcessing,
  date,
  onClick,
}: UploadedFileProps) {
  const uploadDate = new Date(date).toLocaleDateString(
    undefined, {month: "2-digit", year: "2-digit"}
  );

  return (
    <div className={`row${needsProcessing ? " needs-processing" : ""}`} onClick={onClick}>
      <span>{uploadDate}</span>
      <span className="align-end">{formatCO2e(co2e)}</span>
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
};