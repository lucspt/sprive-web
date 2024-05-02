import { OnClickFn } from "../../types"

export const toggleRowDropdown: OnClickFn = e => {
  e.stopPropagation();
  const classList = e.currentTarget.classList;
  classList.toggle("expand");
};

// import { useEffect } from "react"
// import { Header } from "../header/Header";
// import { DataTableProps } from "./types"


// export const ViewAsTable = ({ viewAsTable, setViewAsTable, navigation, btnText="create" }) => {
//   useEffect(() => {
//     localStorage.setItem("prefersTableView", viewAsTable)
//   }, [viewAsTable])

//   return (
//     <div className="view-table">
//     <span 
//       className="material-symbols-rounded white-hov" 
//       style={{fontsize: 30}}
//       onClick={() => setViewAsTable(prev => !prev)}
//     >
//       {!viewAsTable ? "table_rows" : "widgets"}
//     </span>
//     <button  

//       className="default-btn"
//       tabIndex={0}
//       onClick={navigation}
//     >
//       create
//     </button>
//   </div>
//   )
// }
