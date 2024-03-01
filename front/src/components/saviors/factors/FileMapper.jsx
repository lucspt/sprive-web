
import { memo, useState, useRef, useEffect, useCallback } from "react"
import { fetchData } from "../../../utils"
import { useNavigate } from "react-router-dom"
import "./FileMapper.css"

const FileMapper = memo(function FileMapper({
  fileId, 
  chosenActivity, 
  setChosenActivity, 
  possibleUnitTypes,
  setCurrentUnitType,
  unitTypeValue
 }) {
  const [ mappings, setMappings ] = useState([])
  const [ currentMap, setCurrentMap ] = useState({})
  const [ formData, setFormData ] = useState({
    name: "", 
    category: "", 
    value: "",
    unit: "",
    unit_type: "",
    activity: chosenActivity.activity || "",
    activity_id: chosenActivity.activity_id || ""
  })
  const submitRef = useRef()
  const nav = useNavigate()

  useEffect(() => {
    if (!mappings.length) {
      const getMappings = async () => {
        let response = await fetchData(
          `saviors/files/${fileId}?processing-only=True`, "GET"
        )
        const { content } = response 
        setMappings(content)
        const _currentMap = content[0]
        setCurrentMap({"index": 0, "map": _currentMap})
        setFormData({
          "name": _currentMap.name,
          "value": _currentMap.value,
          "category": _currentMap.Category,
          "unit": _currentMap.unit,
          "unit_type": _currentMap.unit_type,
          "activity": _currentMap.activity || "",
          "activity_id": _currentMap.activity_id || "",
          "factor_source": _currentMap.factor_source || "",
        }) 
        if (_currentMap.unit_type) setCurrentUnitType(_currentMap.unit_type)
      }
      getMappings() 
    }
  }, [])

  useEffect(() => {
    if (unitTypeValue === undefined) return
    setFormData(prev => {return {...prev, unit_type: unitTypeValue}})
  }, [unitTypeValue])

  const updateMapping = useCallback((e) => {
    e.preventDefault()
    const _formData = new FormData(e.target)
    let update = Object.fromEntries(_formData.entries())
    update.activity_id = chosenActivity.activity_id
    update.factor_source = chosenActivity.source
    update.value = Number(update.value)
    const { index, map } = currentMap
    const newIndex = index + 1
    setMappings(prev => {
      update = Object.assign(map, update)
      return [...prev.slice(0, index), update, ...prev.slice(newIndex)]
    })
    if (newIndex === mappings.length) {
      setFormData(13)
      setCurrentMap({index: newIndex, currentMap: {}}) 
    } else {
      
      const newMap = mappings[newIndex]
      setCurrentMap(prev => {return {
        "map": newMap,
        "index": prev.index + 1
      }})
      setFormData({
        "name": newMap.name,
        "value": newMap.value,
        "category": newMap.Category,
        "unit": newMap.unit,
        "unit_type": newMap.unit_type,
        "activity": newMap.activity || "",
        "activity_id": newMap.activity_id || "",
        "factor_source": newMap.factor_source || ""
      })   
      if (newMap.unit_type) setCurrentUnitType(newMap.unit_type)
      setChosenActivity({
        activity_id: "", 
        activity: "", 
        source: "", 
        activity_unit_type: ""
    })   
      e.target.reset()
      submitRef.current.blur()
    }
  }, [formData, currentMap, mappings])

  const updateForm = useCallback((field, value) => {
    setFormData(prev => {return {...currentMap, ...prev, [field]: value}})
  }, [formData])

  useEffect(() => {
    console.log(chosenActivity)
    if (chosenActivity.activity_id !== "") {
      setFormData(prev => {
        return {
          ...currentMap, 
          ...prev, 
          "activity_id": chosenActivity.activity_id, 
          "activity": chosenActivity.activity,
          "factor_source": chosenActivity.source
        }
      }
      )
    }
  }, [chosenActivity])

  useEffect(() => {
    console.log(formData, "formdata")
    if (formData.activity) {
      submitRef.current?.focus();
    }
  }, [formData])

  const goBackOne = useCallback(() => {
    const newIndex = currentMap.index - 1
    const newMap = mappings[newIndex]
    setCurrentMap({"index": newIndex, "map": newMap})
    setFormData(newMap)
    if (newMap.unit_type) setCurrentUnitType(newMap["unit_type"])
  }, [currentMap, mappings, formData])

  const calculateEmissions = async () => {
      console.log(mappings)
      const res = await fetchData("saviors/files", "PUT", {"data": mappings,})

      if (res.ok) {
        nav(`../data/tables/${fileId}`, {replace: true})
      }
  }
  
  return currentMap && (
    <div className="hanging-row">
      <span>current row of file {formData === 13 ? currentMap.index : currentMap.index + 1}/{mappings.length}:</span>
      <div className="current-row">
        <div className={`go-back ${currentMap.index > 0}`}>
        <span style={{color: "var(--baby-pink)", fontSize: "var(--fontsize-xs)"}}>go back</span>
        <span
          onClick={goBackOne}
          className="material-symbols-rounded white-hov"
          style={{cursor: "pointer"}}
          >
          arrow_back
        </span>
        </div>
      {
        formData !== 13 ? 
      <form onSubmit={e => updateMapping(e)}>
        <div className="field first">
          <label htmlFor="name">name</label>
          <input 
            aria-required={true}
            required
            type="text"
            name="name"
            id="name"
            autoComplete="off"
            value={formData.name}
            onChange={e => updateForm("name", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="value">value</label>
          <input 
            aria-required={true}
            required
            type="number"
            name="value"
            id="value"
            autoComplete="off"
            value={formData.value}
            onChange={e => updateForm("value", e.target.value)}
          
          />
        </div>
        <div className="field">
          <label htmlFor="category">category</label>
          <input 
            aria-required={true}
            required
            type="text"
            name="category"
            id="category"
            autoComplete="off"
            value={formData.category}
            onChange={e => updateForm("category", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="unit">unit</label>
          <input 
            aria-required={true}
            required
            type="text"
            name="unit"
            id="unit"
            autoComplete="off"
            value={formData.unit}
            onChange={e => updateForm("unit", e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="unit_type">unit_type</label>
          <input 
            aria-required={true}
            required
            readOnly
            type="text"
            name="unit_type"
            id="unit_type"
            list="unit-types"
            autoComplete="off"
            value={formData.unit_type}
            onChange={e => updateForm("unit_type", e.target.value)}
          />
          <datalist id="unit-types">
            {possibleUnitTypes?.map(x => <option value={x} key={x}></option>)}
          </datalist>
        </div>
        <div className="field last">
          <label htmlFor="activity">activity 
            <span className="activity-required">*</span>
          </label>
          <input 
            aria-required={true}
            onFocus={e => e.target.blur()}
            required
            type="text"
            name="activity"
            id="activity"
            autoComplete="off"
            value={formData.activity || ""}
            onChange={e => updateForm("activity", e.target.value)}
          />
        </div>
          <button 
            type="submit"
            className="default-btn focusable"
            ref={submitRef}
            disabled={!formData.activity}
            style={{justifySelf: "flex-end"}}
           >
            submit
          </button>
      </form>
      : 
      <div className="complete">
      <span>ready to calculate!</span>

      <button 
        className="default-btn" style={{height: 35}}
        onClick={calculateEmissions}
      >
        calculate
      </button>
      </div>
    }
    </div>
    </div>
  )
})

export default FileMapper