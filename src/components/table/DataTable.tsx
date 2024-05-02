import { memo } from "react"
import "./DataTable.css"
import { DataTableProps } from "./types"
import { Header } from "../header/Header"

export const DataTable = memo(function DataTable({ 
  columns,
  showOpen,
  title,
  className,
  children,
  headerStyle={},
  HeaderComponent,
  titleSize="lg",
  TitleComponent,
  noData,
  noDataMessage="No results",
  dataTestId
}: DataTableProps) { 
  return (
    <div className="content">
    <div className={`table ${className}${showOpen ? " files" : ""}`} data-testid={dataTestId}>
      { TitleComponent 
          ? TitleComponent
          : title && <Header text={title} fontSize={titleSize} />
      }
      <div className="table-border" style={{ borderBottom: noData ? "var(--table-border)" : "none" }}>
        <div className="upper">
          {
            HeaderComponent 
            ? HeaderComponent
            : (
                <div className="headers row" 
                style={{cursor: "default", ...headerStyle}}
                >
                  {
                    columns.slice(0, -1).map(header => (
                      <span key={header}>{header}</span>
                      ))
                  
                  }
                  <span className="align-end">{columns.at(-1)}</span>
                </div>
              )
              }
        </div>
        <div className="cells">
          {noData && 
            <div className="empty">
              <span>{ noDataMessage }</span>
            </div>
          }
            { children }
        </div>
      </div>
    </div>
  </div>
  )
})