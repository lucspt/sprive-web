import { memo, useState } from "react";
import DataTable, { ViewAsTable }from "../../DataTable";
import { useLoaderData, useNavigate } from "react-router-dom";
import PledgeWidget from "./PledgeWidget"
import PledgeRow from "./PledgeRow"
import "./Pledges.css"
import NoData from "../../NoData";
import Header from "../../Header";
import Modal from "../../Modal";
import { isObjectEmpty } from "../../../utils";
import PledgePopup from "../../pledges/PledgePopup";

const Pledges = memo(function Pledges() {
  const nav = useNavigate();
  const pledges = useLoaderData();
  const [ viewAsTable, setViewAsTable ] = useState(
    JSON.parse(localStorage.getItem("prefersTableView")) || false
  );
  const [ popupPledge, setPopupPledge ] = useState({});
  
  return (
    <div className="pledge-content">
      <Header text="Pledges" />
      <ViewAsTable viewAsTable={viewAsTable} setViewAsTable={setViewAsTable} navigation={() => nav("../pledges/create")}/>
      {pledges.length > 0 ?

        (
          <div className="full-space">
          {viewAsTable ? 
          <DataTable 
          columns={["name", "impact level", "CO2e reduction", "status"]}
          className="pledges encased"
          >
          {pledges.map(p => (
            <PledgeRow 
            pledge={p}
            onClick={() => setPopupPledge(p)}
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
              onClick={() => setPopupPledge(p)}
              />
              ))}
          </div>
        </div>
        }
        <PledgePopup pledge={popupPledge} exit={() => setPopupPledge({})}/>
        </div>
        )
      : <NoData 
        title="you haven't made any pledges yet" 
        message="now's the perfect time" 
        onClick={() => nav("./create")}
      />
      }
    </div>
  )
})

export default Pledges 

// "need visualizations and pick and choose"