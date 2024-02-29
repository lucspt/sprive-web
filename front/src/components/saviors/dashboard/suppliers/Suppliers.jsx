import { memo, useEffect, useState } from "react"
import DataTable, { ViewAsTable } from "../../../DataTable"
import { Link, useNavigate } from "react-router-dom"
import { formatCO2e } from "../../../../utils"

const Suppliers = memo(function Suppliers({ suppliers }) {
  const nav = useNavigate()
  const [ selection, setSelection ] = useState([])
  const [ viewAsTable, setViewAsTable ] = useState(
    JSON.parse(localStorage.getItem("prefersTableView")) || false
  )

  const select = ( selected, setSelected, id ) => {
    if (selected) {
      setSelection(prev => prev.filter(x => x !== id))
      setSelected(false)
    } else {
      setSelection(prev => [...prev, id])
      setSelected(true)
    }
  }

  return (
    <div className="supply-chain">
        <div className="top-flex">
          <Link to={`../learn?topic=suppliers`}>
            <span className="helper-link material-symbols-rounded white-hov">help</span>
          </Link>
        </div>
      <div className="supplier-content">

        <ViewAsTable 
          viewAsTable={viewAsTable}
          setViewAsTable={setViewAsTable}
          navigation={() => null}
          btnText="add"
        />
        {viewAsTable 
          ? <DataTable 
              columns={["", "name", "grade", "spend", "emissions", "category"]}
              className="suppliers"
            >
              {suppliers?.map(s => 
                  <SupplierRow 
                    name={s.name} 
                    id={s._id} 
                    key={s._id}
                    emissions={s.emissions} 
                    spend={s.spend}
                    grade={s.grade}
                    category={s.category}
                    select={(...args) => select(args[0], args[1], args[2])}
                  />
                )
              }
            </DataTable>
          : <div className="showcase suppliers">
            {suppliers.map(s => (
                <SupplierWidget
                  name={s.name}
                  id={s._id} 
                  key={s._id}
                  emissions={s.emissions} 
                  spend={s.spend}
                  grade={s.grade}
                  category={s.category}
                  select={(...args) => select(args[0], args[1], args[2])}
                />
              ))
            }
            </div>
        }
      {selection.length > 0 && 
        <div className="contact">
          <button 
            className="default-btn"
            onClick={() => nav(`../suppliers/${selection.join("&")}`)}
            style={{ alignSelf: "flex-end", }}
          >
            contact
          </button>
        </div>
      }
      </div>
    </div>
  )
})

const SupplierRow = ({ 
  name, grade, spend, emissions, category, select, id
}) => {
  const [ selected, setSelected ] = useState(false)

return name && (
    <div
      className={`row ${selected}`}
      tabIndex={0}
      onClick={() => select(selected, setSelected, id)}
      onMouseEnter={e => {selected  ? e.target.firstChild.innerText = "cancel" : null}}
      onMouseLeave={e => {selected ? e.target.firstChild.innerText = "check_circle" : null}}


    >
      {selected ? 
        <span 
          className="material-symbols-rounded filled"
          style={{ color: "var(--calm-blue)", cursor: "pointer" }}
        >
          check_circle
        </span>
        :
        <span 
          style={{cursor: "pointer"}} 
          className="material-symbols-rounded"
        >
          circle
        </span>
      }
      <span>{name}</span>
      <span className={`indication ${grade}`}>{grade || "N/A"}</span>
      <span>{spend}</span>
      <span style={{paddingLeft: 5}}>{emissions ? formatCO2e(emissions).join(" ") : "N/A"}</span>
      <span className="align-end">{category}</span>
    </div>
  )
}

const SupplierWidget = ({ 
  name, 
  grade, 
  spend, 
  emissions, 
  category, 
  select, 
  id
}) => {

  const [ selected, setSelected ] = useState(false)
  const [ hover, setHover ] = useState(false)

  return name && (
    <div 
      className={`showcase-widget ${selected}${hover ? " hover" : ""}`}
      tabIndex={0} 
      onClick={() =>{setHover(false); select(selected, setSelected, id)}}
      onMouseEnter={() => selected && setHover(true)}
      onMouseLeave={() => selected && setHover(false)}
    >
      <div className="heading">
        <span className="info">
          {name}
          {selected && 
            <span className="selected">
              {hover ? "x" : ""}
            </span>
          }
        </span>
        <div className="info">
          <span style={{ display: "inline" }} className={`rating ${grade}`}>{grade || "N/A"}</span>
          <span style={{fontSize: "0.8em"}}>grade</span>
        </div>
      </div>
      <div className="infos">
        <div className="info">
          <span>spend:</span>
          <span>{spend}</span>
        </div>
        <div className="info">
          <span>emissions:</span>
          <span>{emissions ? formatCO2e(emissions).join(" ") : "N/A"}</span>
        </div>
        <div className="info">
          <span>category:</span>
          <span>{category}</span>
        </div>
      </div>
    </div>
  )
}


export default Suppliers 