import { MouseEvent, useRef } from "react";
import { Header } from "../../header/Header"
import { createCsvFilename, logsToCsv } from "./utils"
import { Logs } from "../../../types";


// The header component of the `<EmissionsByScopeTable />`.
export const ScopesTableHeader = ({ logs }: { logs: Logs }) => {

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    downloadRef.current!.click();
  }
  
  const downloadRef = useRef<HTMLAnchorElement>(null);
  return (
    <Header text="Breakdown" fontSize="lg">
      <button onClick={onClick} id="scopes-table-download">
        <a 
          ref={downloadRef}
          href={logsToCsv(logs)} 
          download={createCsvFilename(logs)} 
          role="button" 
          data-testid="download-emissions"
        >
        </a>
        <span className="material-symbols-rounded white-hov">file_save</span>
      </button>
    </Header>
  )
}