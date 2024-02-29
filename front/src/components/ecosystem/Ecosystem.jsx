import {  useLoaderData, useNavigate } from "react-router-dom"
import { formatCO2e } from "../../utils"
import DataTable from "../DataTable"
import { useEffect, useRef } from "react"
 
export const loader = async () => {
  let ecosystem = await fetch(
    "http://localhost:8000/saviors?type=partners", { method: "GET" }
  )
  ecosystem = await ecosystem.json()
  if (ecosystem.ok) {
    return ecosystem.content
  } else throw new Error("something went wrong")
}
const Ecosystem = function Ecosystem() {

  const ecosystem = useLoaderData();
  const darkBackgroundPoint = useRef()  
  const backgroundRef = useRef()
  const mock = new Array(50).fill(...ecosystem)
  const nav = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([ e ]) => backgroundRef.current?.classList.toggle("dark", !e.isIntersecting)
    )

    if (darkBackgroundPoint.current) {
      console.log("OBSERVING")
      observer.observe(darkBackgroundPoint.current)
    }

    return () => observer.disconnect()
  }, [darkBackgroundPoint])

  return (
    <div className="ecosystem" ref={backgroundRef}>
        <div className="intro">
        <div className="heading">
          <header>
            <h1>the ecosystem</h1>
            <p>we work to protect the life we have been granted</p>
          </header>
        </div>
      </div>
      <div className="saviors">
        <DataTable
          columns={["", "name", "joined", "emissions saved"]}
          >
          {mock?.map((savior, i) => (
            <SaviorRow 
            key={i}
            logo={savior.logo} 
            _name={savior.name} 
            joined={savior.joined} 
            emissionsSaved={savior.emissions_saved}
            viewSavior={() => nav(`./partners/${savior._id}`)}
            />
            ))}
        </DataTable>
      </div>
      <span className="dark-bg" ref={darkBackgroundPoint}></span>
    </div>
  )
}

const SaviorRow = ({ logo, _name, joined, emissionsSaved, viewSavior }) => {

  let _dateJoined = new Date(joined)
  _dateJoined = _dateJoined.toLocaleDateString(
    undefined, {month: "2-digit", year: "2-digit"}
  )
  return (
    <div className="row">
      {logo ? <img src={logo} alt="a profile picture of a business apart of the spt ecosystem" />
      : <span className="material-symbols-rounded">account_circle</span>
      }
      <span>{_name}</span>
      <span>{_dateJoined}</span>
      <span className="align-end">{formatCO2e(emissionsSaved).join(" ")}</span>
      <button onClick={viewSavior} className="view-partner align-end pink-hov">
        <span className="material-symbols-rounded align-end">view_kanban</span>
      </button>
    </div>
  )
}

export default Ecosystem