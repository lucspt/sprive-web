import { memo } from "react"
import "./DataTable.css"

const DataTable = memo(function DataTable({ 
  columns,
  showOpen,
  title,
  className,
  children,
  downloadData = null,
  importData = null,
}) { 
  return columns && (
    <div className="content">
      <div className={`table ${className} ${showOpen ? "files" : "data"}`}>
        { title && 
          <header className="downloadable">
            <h2 style={{fontSize: "1.8em"}}>{title}</h2>
            {
              downloadData && importData ?
                <div style={{ display: "flex", gap: 7 }}>
                  <a href={downloadData} download="data.csv">
                    <span className="material-symbols-rounded white-hov">file_save</span>
                  </a>
                  <Link to={importData}>
                    <span className="material-symbols-rounded white-hov">upload_file</span>
                  </Link>
                </div>
              : downloadData && 
                <a href={downloadData} download="data.csv">
                  <span className="material-symbols-rounded white-hov">file_save</span>
                </a>
            }
          </header>
        }
        <div className="upper">
          <div className="headers row" 
          style={{cursor: "default"}}
          >
            {
              columns.slice(0, -1).map(header => (
                <span key={header}>{header}</span>
              ))
            
            }
            <span className="align-end">{columns.at(-1)}</span>
          </div>
        </div>
        <div className="cells">
            { children }
        </div>
      </div>
    </div>
  )
})

export default DataTable 

export const toggleRowDropdown = e => {
  e.stopPropagation()
  const classList = e.target.classList
  classList.toggle("expand")
}


import { useEffect } from "react"
import { Link } from "react-router-dom"


export const ViewAsTable = ({ viewAsTable, setViewAsTable, navigation, btnText="create" }) => {
  useEffect(() => {
    localStorage.setItem("prefersTableView", viewAsTable)
  }, [viewAsTable])

  return (
    <div className="top-flex" 
    style={{margin: "10px", alignSelf: "flex-end"}}>
    <span 
      className="material-symbols-rounded white-hov" 
      style={{fontsize: 30}}
      onClick={() => setViewAsTable(prev => !prev)}
    >
      {!viewAsTable ? "table_rows" : "widgets"}
    </span>
    <button  

      className="default-btn create"
      tabIndex={0}
      onClick={navigation}
    >
        {btnText}
    </button>
  </div>
  )
}
