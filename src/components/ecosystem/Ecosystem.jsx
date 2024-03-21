import {  useLoaderData, useNavigate } from "react-router-dom"
import SaviorRow from "./SaviorRow"
import DataTable from "../DataTable"
import { useEffect, useRef } from "react"
 
export const loader = async () => {
  let ecosystem = await fetch(
    "http://localhost:8000/partners", { method: "GET" }
  )
  if (ecosystem.ok) {
    ecosystem = await ecosystem.json();
    return ecosystem.content;
  } else throw new Error("oops, something wen't wrong");
}
const Ecosystem = function Ecosystem() {

  const ecosystem = useLoaderData();
  const mock = new Array(50).fill(...ecosystem);
  const nav = useNavigate();


  return (
    <div className="ecosystem">
        <div className="intro">
        <div className="heading">
          <header>
            <h1>The Ecosystem</h1>
            <p>We work to protect the life we have been granted</p>
          </header>
        </div>
      </div>
      <div className="saviors">
        <DataTable
          columns={["", "company name", "joined", "emissions saved"]}
          >
          {mock?.map((savior, i) => (
            <SaviorRow 
            key={i}
            logo={savior.logo} 
            name={savior.username} 
            joined={savior.joined} 
            emissionsSaved={savior.emissions_saved}
            viewSavior={() => nav(`./partners/${savior._id}`)}
            />
            ))}
        </DataTable>
      </div>
    </div>
  )
}

export default Ecosystem