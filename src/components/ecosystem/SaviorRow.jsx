import { formatCO2e } from "../../utils/utils"

export default function SaviorRow({ logo, name, joined, emissionsSaved, viewSavior }) {

  let dateJoined = new Date(joined)
  dateJoined = dateJoined.toLocaleDateString(
    undefined, {month: "2-digit", year: "2-digit"}
  )
  return (
    <div className="row">
      {logo ? <img src={logo} alt="a profile picture of a business apart of the spt ecosystem" />
      : <span className="material-symbols-rounded">account_circle</span>
      }
      <span>{name}</span>
      <span>{dateJoined}</span>
      <span className="align-end">{formatCO2e(emissionsSaved).join(" ")}</span>
      <button onClick={viewSavior} className="view-partner align-end pink-hov">
        <span className="material-symbols-rounded align-end">view_kanban</span>
      </button>
    </div>
  )
}