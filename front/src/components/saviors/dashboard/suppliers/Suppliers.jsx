import { memo, useState } from "react"
import DataTable, { ViewAsTable } from "../../../DataTable"
import { Link, useNavigate } from "react-router-dom"
import "./Suppliers.css"
import SupplierWidget from "./SupplierWidget"
import SupplierRow from "./SupplierRow"

const Suppliers = memo(function Suppliers({ suppliers }) {
  const nav = useNavigate();
  const [ selection, setSelection ] = useState([]);
  const [ viewAsTable, setViewAsTable ] = useState(
    JSON.parse(localStorage.getItem("prefersTableView")) || false
  )

  const select = ( selected, setSelected, id ) => {
    if (selected) {
      setSelection(prev => prev.filter(x => x !== id));
      setSelected(false);
    } else {
      setSelection(prev => [...prev, id]);
      setSelected(true);
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
            style={{ alignSelf: "flex-end" }}
          >
            contact
          </button>
        </div>
      }
      </div>
    </div>
  )
})


export default Suppliers 