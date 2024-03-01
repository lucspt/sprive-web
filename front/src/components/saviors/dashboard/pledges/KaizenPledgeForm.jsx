import { useCallback, useEffect, useState } from "react"
import ValidatedInput from "../../../ValidatedInput"
import DropDownInput from "../../../DropdownInput"

export default function KaizenPledgeForm ({ 
  activity, 
  setChoosingFactor, 
  isRecurring, 
}) {

  const [ requiredInputs, setRequiredInputs ] = useState({});

  const setState = (e) => {
    setRequiredInputs(prev => {return {...prev, [e.target.name]: e.target.value}});
    // if (canInitiate())
  }
  useEffect(() => {
    setRequiredInputs(prev => {return {...prev, "activity": activity}});
  }, [activity])

  const canInitiate =  useCallback(() => {
    const required = isRecurring ? 
    ["activity", "name", "description", "value", "unit", "frequency", "frequency_value"]
    : ["activity", "name", "description", "value", "unit"]
    return required.every(x => requiredInputs[x]);
  }, [requiredInputs]);

  return (
    <>
      <div className="input-wrapper" style={{ paddingTop: 60 }}>
        <div className="field">
          <ValidatedInput 
            type="text"
            onChange={e => setState(e)}
            name="name" 
            label="name"
            />
        </div>
        <div className="field">
          <button 
            onClick={() => setChoosingFactor(true)} 
            style={{ pointerEvents: "all" }} 
            type="button"
          >
            <ValidatedInput
              label="activity"
              onChange={e => setState(e)}
              style={{ textAlign: "start" }} 
              name="activity"
              defaultValue={activity}
              readOnly={true}
            />
          </button>
        </div>
      </div>
      <div className="input-wrapper">
        <div className="field">
          <ValidatedInput  
            type="number"
            name="value"
            onChange={e => setState(e)}
            label="value"
          />
        </div>
          <div className="field">
            <ValidatedInput
              label="unit"
              onChange={e => setState(e)}
              name="unit" 
            />
          </div>
      </div>
      {isRecurring &&
        <div className="input-wrapper frequencies">
        <div className="field">
          <ValidatedInput 
            type="number"
            onChange={e => setState(e)}
            name="frequency_value"
            label="frequency value"
            />
        </div>
        <div className="field">
          <DropDownInput
            values={["daily", "weekly", "monthly", "yearly"]}
            name="frequency"
            onChange={e => setState(e)}
            label="frequency"
            inputClass="transparent-input"
            className="field"
            style={{ flexDirection: "column-reverse",}}
            />
        </div>
      </div>
      }
        <div className="input-wrapper" style={{ paddingLeft: 120 }}>
        <div className="field" style={{position: "relative"}}>
          <label htmlFor="description" style={{paddingLeft: 7}}>description</label>
          <textarea 
            type="text"
            onChange={e => setState(e)}
            id="description"
            name="description"
            onInvalid={e => e.target.classList.add("invalid")}
            />
          </div>
          <div className="field insert-image">
            <input type="file" accept="image/*" />
            <span className="material-symbols-rounded image">image</span>
            <span className="label">upload image</span>
          </div>
        </div>
      <div 
        className="submit"
        style={{ justifySelf: "flex-end" }} 
      >
        <button 
          disabled={!canInitiate()}
          type="submit"
          className="default-btn"
          >
            initiate
        </button>
      </div>
    </>
  )
}