import { memo, useState } from "react";
import DataTable, { ViewAsTable }from "../../../DataTable";
import { useNavigate } from "react-router-dom";
import PledgeWidget from "./PledgeWidget"
import PledgeRow from "./PledgeRow"
import "./Pledges.css"

const Pledges = memo(function Pledges({ pledges }) {
  const nav = useNavigate();
  const [ viewAsTable, setViewAsTable ] = useState(
    JSON.parse(localStorage.getItem("prefersTableView")) || false
  );
  
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
        {pledges.map(p => (
          <PledgeRow 
            pledge={p}
            onClick={() => nav(`../pledges/${p._id}`)}
            key={p._id} 
          />
        ))}
      </DataTable>
      : 
      <div className="pledges widgets">
        <div className="widget-showcase">
          {pledges.map(p => (
          <PledgeWidget 
            pledge={p} 
            key={p._id} 
            onClick={() => nav(`../pledges/${p._id}`)}
          />
            ))}
        </div>
      </div>
      }
    </div>
  )
})

export default Pledges 

// "need visualizations and pick and choose"