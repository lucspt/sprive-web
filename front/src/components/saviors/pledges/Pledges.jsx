import { memo, useState } from "react";
import DataTable, { ViewAsTable }from "../../DataTable";
import { useNavigate } from "react-router-dom";
import { formatCO2e } from "../../../utils";

const Pledges = memo(function Pledges({ pledges }) {
  const nav = useNavigate()
  console.log(pledges)
  const [ viewAsTable, setViewAsTable ] = useState(
    JSON.parse(localStorage.getItem("prefersTableView")) || false
  )  
  
  return (

    <div className="pledge-content" style={{width: "100%"}}>
      <ViewAsTable viewAsTable={viewAsTable} setViewAsTable={setViewAsTable} navigation={() => nav("../pledges/create")}/>
      {
        pledges && 
        viewAsTable ? 
        <DataTable 
        columns={["name", "impact level", "CO2e reduction", "status"]}
        className="pledges encased"
        >
        {pledges.map(p => 
          <PledgeRow 
            pledge={p}
            nav={nav}
            key={p._id} 
          />
        )}
      </DataTable>
      : 
      <div className="pledges widgets">
        <div className="widget-showcase">
          {pledges.map(p => <PledgeWidget pledge={p} key={p._id} nav={nav}/>
            )}
        </div>
      </div>
      }
    </div>
  )
})

const PledgeRow = memo(({ pledge, nav }) => {
  
  let { impact_level: indicator, name, co2e } = pledge
  indicator = indicator || ["good", "normal", "great"][~~(Math.random() * 3)]

  return (
    <div 
      className="row"
      tabIndex={0}
      onClick={() => nav(`../pledges/${pledge._id}`)}
    > 
      <span>{name}</span>
      <span className={`indication ${indicator}`}>{indicator}</span>
      <span>{formatCO2e(co2e).join(" ")}</span>
      <span className="align-end">{pledge.status || "active"}</span>
      <span className="material-symbols-rounded align-end flip pink-hov">equalizer</span>
    </div>
  )
})

const PledgeWidget = ({ pledge, nav }) => {
  let { impact_level } = pledge
   impact_level = impact_level || ["good", "normal", "great"][~~(Math.random() * 3)]

  return (
    <div className="showcase-widget" 
    tabIndex={1} onClick={() => nav(`../pledges/${pledge._id}`)}
    >
      <div className="title description">
        <span style={{fontSize: "1.12em"}} className="label">{pledge.name}</span>
        <span className={`indication ${impact_level}`}></span>
      </div>
      <div className="pledge-info">
        <div className="info-columns">
          <span>CO2e reduction:</span>
          <span>{formatCO2e(pledge.co2e_factor).join(" ")}</span>
        </div>
        <div className="info-columns">
          <span>total CO2e:</span>
          <span>{formatCO2e(pledge.co2e).join(" ")}</span>
        </div>
        <div className="reflection"></div>
      </div>
    </div>
  )
}

export default Pledges 

// "need visualizations and pick and choose"