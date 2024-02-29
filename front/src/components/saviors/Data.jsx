import { useRef } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { toggleRowDropdown } from "../DataTable";


export default function Data() {

  const pagesRef = useRef()

  return (
      <div className="data" style={{height: "100%", overflow: "scroll"}}>
        <div className="data-routes">
          <span 
            tabIndex={1}
            className="material-symbols-rounded pages-toggle"
            >
            menu
          </span>
          <div className="pages" ref={pagesRef} tabIndex={0}> 
            <NavLink to="/saviors/data"
              className="page pink-hov"
              end={true}
              onClick={e => e.target.blur()}
            >
              <span className="material-symbols-rounded">data_object</span>
              data hub
            </NavLink>
            <NavLink 
              tabIndex={0}
              to="plots"
              className="page pink-hov"
              onClick={e => e.target.blur()}
            >
              <span className="material-symbols-rounded">bar_chart</span>
                visualize
            </NavLink>
            <NavLink 
              tabIndex={0}
              to="tables" 
              className="page pink-hov"
              onClick={e => e.target.blur()}
              >
                <span className="material-symbols-rounded">
                  table_rows
                </span>
                view files
            </NavLink>
          </div>
        </div>
        <Outlet />
      </div>
  )
}

<div className="top-flex">
<div className="buttons">
  <div className="left">
    <NavLink to="." end={true} className="default-btn">
      <span className="material-symbols-rounded">bar_chart</span>
      visualize
    </NavLink>
    <NavLink 
    to="tables" 
    className="default-btn"
    >
      <span className="material-symbols-rounded">
        table_rows
      </span>
      view files
    </NavLink>
    <NavLink 
      to="timelines"
      className="default-btn">
        <span className="material-symbols-rounded">
          timeline
        </span>
        timelines
    </NavLink>
  </div>
  <div className="right">
    <div className="actions" style={{display: "flex", gap: "15px"}}>

    <NavLink 
      className="default-btn"
      to="upload"
      >
      <span className="material-symbols-rounded">upload</span>
        import data
    </NavLink>
    <NavLink 
    className="default-btn"
    to="customize"
    >
      <span className="material-symbols-rounded">tune</span>
        customize charts
    </NavLink>
    </div>
  </div>
</div>
</div>