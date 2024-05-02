import { useState, memo, useEffect } from "react"
import { fetchWithAuth, formatCO2e } from "../../../utils/utils"
import { toggleRowDropdown } from "../../table/utils";
import DropdownInput from "../../DropdownInput"

const FactorRow = memo(({
  factor, 
  setChosenActivity, 
  saviorId, 
  refreshResults,
  setUnitTypeValue,
  chosenActivity
}) => {
  const { activity } = factor
  const [ chosenFactor, setChosenFactor ] = useState({
    activity_unit_type: "", 
    activity_id: "", 
    activity: ""
  })
  const [ refresh, setRefresh ] = useState(0)
  const [ openModal, setOpenModal ] = useState(false);

  const isBookmarked = factor.saved_by?.includes(saviorId)
  const handleBookmark = async e => {
    e.stopPropagation();
    const method = isBookmarked ? "DELETE" : "PATCH"
    fetchWithAuth(`saviors/factors/bookmarks/${factor._id}`, { method });
    e.target.classList.toggle("filled")
    refreshResults()
  }

  useEffect(() => {
    if (chosenFactor.activity && chosenFactor.activity_unit_type) {
      setChosenActivity(chosenFactor)
    }
  }, [chosenFactor])

  useEffect(() => {
    if (chosenActivity && Object.values(chosenActivity).every(x => x === "")) {
      setRefresh(prev => prev + 1)
    }
  }, [chosenActivity])

  return (
    <div className="row-wrapper" 
      onClick={e => toggleRowDropdown(e)} 
      // key={refresh}
    >
    <div className="row">
      <span>{activity}</span>
      <span>{factor.source || "ecoinvent"}</span>
      <span>{factor.region || "US"}</span>
      <span>{factor.year || "2024"}</span>
      <span className="align-end">{factor.unit_types}</span>
      <span className="material-symbols-rounded align-end flip">
        expand_more
      </span>
    </div>
      <div className="dropdown">
        
        <div className="description">
          <div className="title">
            <h4>{factor.activity}</h4>
            <p className="line-clamp">
              {factor.keywords}
            </p>
          </div>
          <div>
            <span 
              className={`material-symbols-rounded${isBookmarked ? " filled" : ""}`} 
              style={{cursor: "pointer", fontSize: 30}}
              onClick={e => handleBookmark(e, isBookmarked)}
            >
              bookmark
            </span>
          </div>
        </div>
        <div className="insights">
          <div className="infos">
            <div className="info">
              <span>CO2e factor:</span>
              <span>{formatCO2e(factor.co2e || 10)}</span>
            </div>
            <div className="info">
              <span>last updated:</span>
              <span>{factor.year || "2024"}</span>
            </div>
            {/* <div className="info">
              <span>keywords:</span>
              <span 
                style={{maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis"}}
              >
                {factor.keywords}
              </span>
            </div> */}
          </div>
        </div>
          {setChosenActivity &&
            <div className="extra-options">
            <button
              type="button" 
              className="default-btn"
              disabled={!chosenFactor.activity_unit_type}
              style={{ width: 120 }}
              onClick={e => {
                const { activity, activity_id, description } = factor 
                setChosenFactor(prev => {
                  return {
                  ...prev, 
                  activity: activity,
                  activity_id: activity_id,
                  activity_description: description, 
                }})
                setUnitTypeValue && setUnitTypeValue(chosenFactor.activity_unit_type)
                e.target.parentElement.parentElement.parentElement.click();
              }
              }
              >
                select factor
              </button>
              <DropdownInput
                id={factor._id}
                placeholder="unit type"
                key={refresh}
                onInvalid={() => {
                  setChosenFactor(
                    prev => {return {...prev, activity_unit_type: ""}}
                  )
                }}
                values={factor?.unit_types}
                onValid={val => {
                  setChosenFactor(
                  prev => {return {...prev, activity_unit_type: val}}
              )
            }} 
            />
          </div>
          }
      </div>
    </div>
  )
})


{/* <div>
<div className="row full-space" onClick={() => setOpenModal(true)} role="button">
  <span>{activity}</span>
  <span>{factor.source || "ecoinvent"}</span>
  <span>{factor.region || "US"}</span>
  <span>{factor.year || "2024"}</span>
  <span className="align-end">{factor.unit_types || "physical"}</span>
  <span className="material-symbols-rounded align-end flip">
    bottom_panel_open
  </span>
</div>
<Modal 
  visible={openModal} 
  close={() => setOpenModal(false)} 
  backgroundColor="var(--primary-color)"
  
/>
</div> */}

export default FactorRow