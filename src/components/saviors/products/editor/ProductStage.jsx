import { useState } from "react"
import ProcessWidget from "./ProcessWidget"
import { formatCO2e } from "../../../../utils"
import { _REQUIRED_STAGES } from "./ProductEditor"

export default function ProductStage ({ 
  stage, 
  showFactors, 
  editProcess, 
  deleteProcess,
  setWarnDeletion,
}) {
  const { processes } = stage 
  const [ expanded, setExpanded ] = useState(() => processes.length ? "" : " expand")

  const expand = () => {
    const mapping = {"": " expand", " expand": ""}
    setExpanded(prev => mapping[prev])
  }  

  return stage.stage && (
    <>
      <div className={`stage item${expanded}`} onClick={expand}>
        <div className="stage-info">
          <div className="heading">
            <span>{stage.stage}</span>
            {/* <span className={`rating indication`}></span> */}
          </div>
          <div className="infos">
            <div className="info" style={{alignItems: "flex-start"}}>
              <CO2eSpan fontSize="1.3em" digit={stage.co2e} />
              <span>processes: {stage.num_processes}</span>
            </div>
            <div className="action-btns" style={{alignSelf: "flex-end"}}>
              <button tabIndex={0}>
                <span className="material-symbols-rounded flip">expand_more</span>
              </button>
            </div>
          </div>
        </div>
        </div>
        <div className="processes">
          <button tabIndex={0} className="add" onClick={showFactors}>
             <span className="material-symbols-rounded align-end">add</span>
            </button>
          {stage.processes?.map((process, i) => (
            <ProcessWidget 
              process={process} 
              key={process._id || i}
              editProcess = {process => {
                editProcess({
                  type: "edit_process", 
                  payload: {processToEdit: i, process: process}
                })
              }}
              deleteProcess={id => deleteProcess(id)}
              setWarnDeletion={setWarnDeletion && processes.length === 1 && setWarnDeletion}
            />
          ))}
        </div>
    </>
  )
}

const CO2eSpan = ({ digit, fontSize }) => {
  const [ co2e, metric ] = formatCO2e(digit)

  return (
    <span style={{ display: "flex", gap: 7, alignItems: "center" }}>
      Co2e:
      <span >
      <span style={{ fontSize: fontSize, marginRight: 5 }}>{co2e}</span>
        {metric}
      </span>
    </span>
  )
}