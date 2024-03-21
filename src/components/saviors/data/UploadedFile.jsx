
export default function UploadedFile() {
  const uploadDate = new Date(date).toLocaleDateString(
    undefined, {month: "2-digit", year: "2-digit"}
  );
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