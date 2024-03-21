import { memo, useState } from "react"
import DataTable, { ViewAsTable } from "../../DataTable"
import { Link, useLoaderData, useNavigate } from "react-router-dom"
import "./Suppliers.css"
import SupplierWidget from "./SupplierWidget"
import SupplierRow from "./SupplierRow"
import NoData from "../../NoData";
import Header from "../../Header";

const Suppliers = memo(function Suppliers() {
  const nav = useNavigate();
  const suppliers = useLoaderData();
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
      { suppliers.length > 0
      ?
      (
        <div className="supplier-content">

          <Header text="Suppliers" />

          <ViewAsTable 
            viewAsTable={viewAsTable}
            setViewAsTable={setViewAsTable}
            navigation={() => null}
            btnText="create"
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
      )
      : <NoData 
          title="you haven't added any suppliers yet"
          message="would you like to now?"
          onClick={() => nav("add")}
          buttonText="add suppliers"
          style={{height: "100%", justifyContent: "center"}}
        />
      }
    </div>
  )
})


export default Suppliers 