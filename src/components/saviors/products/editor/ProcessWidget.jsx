import ValidatedInput from "../../../ValidatedInput";
import { formToObj, formatCO2e } from "../../../../utils"

export default function ProcessWidget ({ 
  process, 
  editProcess, 
  deleteProcess, 
  setWarnDeletion 
}) {
  const { co2e } = process
  const protectedDeletion = () => {
    setWarnDeletion ? setWarnDeletion() : deleteProcess(process._id)
  }

  return (
    <form 
      className="process item" 
      onSubmit={e => {
        e.preventDefault(); 
        editProcess(formToObj(e.target))
        document.activeElement.blur();
      }}
      >
      <div className="heading">
        <ValidatedInput
          defaultValue={process.activity}
          name="activity"
          autoComplete="off"
          required 
          />
        <div className="activity-metrics">
          <ValidatedInput
            placeholder="value"
            type="number"
            defaultValue={process.activity_value}
            name="activity_value" />
          <ValidatedInput
            placeholder="unit"
            type="text"
            defaultValue={process.activity_unit}
            name="activity_unit" />
        </div>
        <div className="id-hover">
          <span className="material-symbols-rounded pink-hov">info</span>
          <span className="id-after">{process.activity_id}</span>
        </div>
      </div>
      <div className="bottom-row">
        {co2e && <span>{formatCO2e(co2e).join(" ")}/CO2e</span>}
        <div className="action-btns" style={{alignSelf: "flex-end"}}>
          <button type="button" tabIndex={0}>
            <span 
              className="material-symbols-rounded pink-hov"
              onClick={protectedDeletion}
              >
                delete
              </span>
          </button>
        </div>
      </div>
      <input type="submit" style={{display: "none"}} />
    </form>
  )
}