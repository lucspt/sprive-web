import { memo } from "react"
import { Header } from "../../header/Header"
import "./SupplyChain.css"
import StatSquare from "../StatSquare";
import { useState } from "react";
import ModalForm from "./ModalForm";
import SuppliersTable from "./SuppliersTable";

const SupplyChain = memo(function SupplyChain() {
  const [ showSideModal, setShowSideModal ] = useState(false);
  const [ selectedSuppliers, setSelectedSuppliers ] = useState([]);

  function selectSupplier(supplier) {
    setSelectedSuppliers(prev => prev.concat(supplier));
  };

  function deselectSupplier(supplier) {
    setSelectedSuppliers(prev => prev.filter(x => x !== supplier));
  };

  return (
    <div className="supply-chain page">
      <Header text="Supply chain" />
      <div className="stats-row">
        <StatSquare digit={123} title="Total supply chain CO₂e"/>
        <StatSquare digit={1} title="# suppliers contacted" />
        <StatSquare digit={1} title="# responses" />
      </div>
      <section className="charts">
        <div className="chart" />
        <div className="chart" />
      </section>
      <section className="table">
        <SuppliersTable 
          showModal={() => setShowSideModal(true)}
          selectSupplier={selectSupplier}
          deselectSupplier={deselectSupplier}
          selectedSuppliers={selectedSuppliers}
        />
      </section>
      <ModalForm visible={showSideModal} close={() => setShowSideModal(false)}/>
    </div>
  )
})


export default SupplyChain 

// import { memo, useState } from "react"
// import { DataTable }, { ViewAsTable } from "../../table/DataTable";
// import { Link, useLoaderData, useNavigate } from "react-router-dom"
// import SupplierWidget from "./SupplierWidget"
// import SupplierRow from "./SupplierRow"
// import NoData from "../../NoData";
// import { Header } from "../../header/Header";
  // const nav = useNavigate();
  // const suppliers = useLoaderData();
  // const [ selection, setSelection ] = useState([]);
  // const [ viewAsTable, setViewAsTable ] = useState(
  //   JSON.parse(localStorage.getItem("prefersTableView")) || false
  // )

  // const select = ( selected, setSelected, id ) => {
  //   if (selected) {
  //     setSelection(prev => prev.filter(x => x !== id));
  //     setSelected(false);
  //   } else {
  //     setSelection(prev => [...prev, id]);
  //     setSelected(true);
  //   }
  // }
// return (
//   <div className="suppliers page">
//     <Header text="Suppliers" />
//     { suppliers.length > 0
//     ?
//     (
//       <div className="supplier-content">
//         <ViewAsTable 
//           viewAsTable={viewAsTable}
//           setViewAsTable={setViewAsTable}
//           navigation={() => null}
//           btnText="create"
//         />
//         {viewAsTable 
//           ? <DataTable 
//               columns={["", "name", "grade", "spend", "emissions", "category"]}
//               className="suppliers"
//             >
//               {suppliers?.map(s => 
//                   <SupplierRow 
//                     name={s.name} 
//                     id={s._id} 
//                     key={s._id}
//                     emissions={s.emissions} 
//                     spend={s.spend}
//                     grade={s.grade}
//                     category={s.category}
//                     select={(...args) => select(args[0], args[1], args[2])}
//                   />
//                 )
//               }
//             </DataTable>
//           : <div className="showcase suppliers">
//             {suppliers.map(s => (
//                 <SupplierWidget
//                   name={s.name}
//                   id={s._id} 
//                   key={s._id}
//                   emissions={s.emissions} 
//                   spend={s.spend}
//                   grade={s.grade}
//                   category={s.category}
//                   select={(...args) => select(args[0], args[1], args[2])}
//                 />
//               ))
//             }
//             </div>
//         }
//       {selection.length > 0 && 
//         <div className="contact">
//           <button 
//             className="default-btn"
//             onClick={() => nav(`../suppliers/${selection.join("&")}`)}
//             style={{ alignSelf: "flex-end" }}
//           >
//             contact
//           </button>
//         </div>
//       }
//       </div>
//     )
//     : <NoData 
//         title="you haven't added any suppliers yet"
//         message="would you like to now?"
//         onClick={() => nav("add")}
//         buttonText="add suppliers"
//         style={{height: "100%", justifyContent: "center"}}
//       />
//     }
//   </div>
// )