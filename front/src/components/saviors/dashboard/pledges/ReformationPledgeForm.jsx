import ValidatedInput from "../../../ValidatedInput"
import { useEffect, useState } from "react"

const ReformationPledgeForm = ({
  factor, 
  setChoosingFactor, 
  isRecurring, 
  setFactor,
}) => {

  const [ reformationInfo, setReformationInfo ] = useState({activity: ""});
  const [ step, setStep ] = useState(1);
    
  const getInputNames = () => {
    return isRecurring 
      ? ["activity", "value", "unit", "frequency", "frequency_value"]
      : ["activity", "value", "unit",]
  }

  const setReformation = (name, value) => {
    setReformationInfo(prev => {return {...prev, [name]: value}});
  }

  useEffect(() => {
    if (step === 2) {
      setReformationInfo(prev => {return {...prev, ...factor}});
    }
  }, [factor])

  const toStepThree = () => {
    setFactor({activity: "", activity_unit_type: ""});
    setStep(3);
  }

  return (
    <>
      <div className="progress">
        <div className={`step${step > 1 ? " filled" : ""}`}></div>
        <div className={`step${step > 2 ? " filled" : ""}`}></div>
        <div className={`step${step === 3 ? " filled" : ""}`}></div>
      </div>
      <div 
        style={{ 
          display: step === 1 ? "flex" : "none",
          gap: 40,
          minWidth: 350,
          width: "100%",
          justifyContent: "center",
          paddingLeft: 125,
          height: "fit-content"
        }}
      >
        <div
          style={{ display: "flex", flexDirection: "column", gap: 50}}
        >
          <ValidatedInput 
            name="name"
            style={{ maxWidth: 385 }}
            label="what will you name this pledge"
            onChange={e => setReformation("name", e.target.value)}
          />
          <div className="field" style={{position: "relative"}}>
            <label htmlFor="description">description</label>
            <textarea 
              onChange={e => setReformation("description", e.target.value)}
              type="text"
              id="description"
              name="description"
            />
          </div>
          </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div className="field insert-image" style={{ bottom: 0, top: 0 }}>
            <input type="file" accept="image/*" />
            <span className="material-symbols-rounded image">image</span>
            <span className="label">upload image</span>
          </div>
          <div 
            className="submit"
            style={{ alignSelf: "flex-end", marginRight: 15 }} 
          >
            <button 
              type="button"
              disabled={!reformationInfo.name || !reformationInfo.description}
              onClick={() => setStep(2)}
              className="default-btn"
            >
              next
            </button>
          </div>
        </div>
      </div>
      <div className="reform-section" style={{ display: step === 2 ? "flex" : "none" }}>
        <div className="reformation-row" key={1}>
          {
            getInputNames(isRecurring)?.map(
                name => (
                  name !== "name" && 
                    name === "activity" ?  
                    <button type="button" onClick={() => setChoosingFactor(true)} key={name}>
                      <ValidatedInput 
                        name={`_${name}`} 
                        defaultValue={reformationInfo.activity}
                        readOnly={true}
                        label="the activity to swap"
                        key={factor.activity} 
                      />
                    </button>
                    :
                    <ValidatedInput 
                      name={`_${name}`} 
                      onChange={e => setReformation(name, e.target.value)}
                      label={name}
                      key={`_${name}`}
                    />
                )
              )
            }
        </div>
        <div 
          className="submit"
          style={{ justifySelf: "flex-end" }} 
        >
          <button 
            type="button" 
            className="default-btn"
            onClick={toStepThree} 
            disabled={!getInputNames().every(x => reformationInfo[x])} 
          >next</button>
        </div>
      </div>
      <div className="reform-section" style={{ display: step === 3 ? "flex" : "none" }}>
        <div className="reformation-row">
          {
            getInputNames(isRecurring)?.map(
              name => (
              name !== "name" && 
              name === "activity" ? 
                <button 
                  type="button" 
                  onClick={() => setChoosingFactor(true)} 
                  key={name}
                >
                  <ValidatedInput 
                    name={name}
                    defaultValue={factor.activity}
                    label="the reforming activity"
                    key={factor.activity}
                    />
                </button>
                :
                <ValidatedInput 
                name={name}
                label={name}
                onChange={e => setReformation(name, e.target.value)}
                key={name}
                />
              )
            )
          }
        </div>
        <div 
        className="submit" 
        style={{ justifySelf: "flex-end" }}>
          <button className="default-btn" type="submit">initiate</button>
        </div>
      </div>
    </>
  )
}

export default ReformationPledgeForm