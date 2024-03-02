import { useState, memo, useEffect } from "react"
import { formatCO2e } from "../../../utils"
import { toggleRowDropdown } from "../../DataTable"
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

  const isBookmarked = factor.saved_by?.includes(saviorId)
  const handleBookmark = async e => {
    const method = isBookmarked ? "DELETE" : "PATCH"
    fetchData(`saviors/factors/bookmarks/${factor._id}`, method)
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
      <span className="align-end">{factor.unit_types || "physical"}</span>
      <span className="material-symbols-rounded align-end flip">
        expand_circle_down
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
              <span>{formatCO2e(factor.co2e || 10).join(" ")}</span>
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
                const { activity, activity_id } = factor 
                setChosenFactor(prev => {
                  return {
                  ...prev, 
                  activity: activity,
                  activity_id: activity_id,
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
                  console.log("SETTING", val, "FORRR", factor.activity)
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

export default FactorRow