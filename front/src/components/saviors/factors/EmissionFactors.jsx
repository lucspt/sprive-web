import DataTable, { toggleRowDropdown }  from "../../DataTable"
import {  useFetcher, useLocation, useNavigate } from "react-router-dom"
import { fetchData, formatCO2e } from "../../../utils"
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react"
import { SaviorContext } from "../../../contexts/SaviorContext"
import FileMapper from "./FileMapper"
import DropdownInput from "../../DropdownInput"

export const loader = async ({ request }) => {
  const req = request.url.split("?").slice(1).at(0)
  if (req) {
    const params = req.split("&").filter(x => x.slice(-1) !== "=").join("&")
    let response = await fetchData(`factors?${params}`, "GET", {}, {}, null)
    return response
  } else return null;
}

const EmissionFactors = memo(function EmissionFactors({ backButton=null, returnFactor=null }) {
  const tableColumns = ["name", "source", "region", "year", "unit type"]
  const { state } = useLocation()
  const nav = useNavigate();
  const { savior: { like_resource: saviorId }} = useContext(SaviorContext)
  const fetcher = useFetcher({key: "emissionFactors"})
  const [ currentPage, setCurrentPage ] = useState(1)
  const [ chosenActivity, setChosenActivity ] = useState("")
  const [ queryBookmarks, setQueryBookmarks ] = useState("")
  const [ unitTypeValue, setUnitTypeValue ] = useState(undefined)
  const formRef = useRef()

  const refreshResults = useCallback(() => {
    let queries = new FormData(formRef.current)
    queries = Object.fromEntries(queries)
    queries.skip = (currentPage - 1) * queries.limit 
    fetcher.submit(queries, {action: "/saviors/factors"})
  }, [fetcher, queryBookmarks, currentPage])

  useEffect(() => {
    refreshResults()
  }, [queryBookmarks, currentPage])

  const calcLastPage = useCallback(() => {
    if (fetcher.data && formRef.current) {
        const max = fetcher.data.max_results / formRef.current.elements["limit"].value
        return Math.ceil(Math.max(1, max))
    } else return 1
  }, [fetcher, formRef])

  useEffect(() => {console.log(fetcher?.data, "dDATAAAA")}, [fetcher])

  return (
    <div className={`emission-factors`}>
      <div className="sidebar filters">
        {backButton && 
          <button className="back" onClick={backButton}>
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
        }
        <fetcher.Form replace className="fetcher" ref={formRef} action="/saviors/factors">
            <DropdownInput
              values={fetcher.data?.possibilities?.activity}
              name="activity"
              id="activity"
              submitOnEmpty={true}
              submitOnClick={true}
              inputClass="rounded-input"
              className="field"
              label="activity"
              placeholder="saving.."
            />
          <DropdownInput
            name="region"
            submitOnEmpty={true}
            submitOnClick={true}
            id="region"
            inputClass="rounded-input"
            className="field"
            placeholder="the world.."
            label="region"
            values={fetcher.data?.possibilities?.region}
          />
          <DropdownInput 
            label="unit type"
            submitOnEmpty={true}
            submitOnClick={true}
            id="unit type"
            placeholder="one factor.."
            values={fetcher.data?.possibilities?.unit_types}
            name="unit_types"
            inputClass="rounded-input"
            className="field"
          />
          <DropdownInput
            label="source"
            submitOnEmpty={true}
            submitOnClick={true}
            id="source"
            placeholder="at a time"
            values={fetcher.data?.possibilities.source}
            name="source"
            inputClass="rounded-input"
            className="field"
          />
            <div className="bookmark-container">
              <input
                type="text"
                autoComplete="off"
                readOnly={true}
                className="bookmarks default-btn"
                name="saved"
                style={{textIndent: -9999}}
                value={queryBookmarks}
                onClick={() => setQueryBookmarks(prev => {
                  const mappings = {"": true, [true]: ""}
                  return mappings[prev]
                })}
                />
                <span 
                  className={`material-symbols-rounded${queryBookmarks ? " filled" : ""}`}
                >
                  bookmark
                </span>
              </div>
            <div className="input-field limit">
              <label># of results</label>
              <input 
                type="number" 
                name="limit" 
                max={50} 
                defaultValue={25} 
              />
            </div>
          <input type="submit" hidden />
        <div className="page-info">
        </div>
        </fetcher.Form>
        <button className="create default-btn" onClick={() => nav("create")}>create factor</button>
      </div>
      { state?.processFile ? 
        <div className="file-mapping">
          <FileMapper 
            fileId={state.processFile}
            setCurrentUnitType={setUnitTypeValue}
            unitTypeValue={unitTypeValue}
            chosenActivity={chosenActivity}
            setChosenActivity={setChosenActivity}
           />
          <DataTable 
            columns={tableColumns} 
            className="factors"
            // title={`${fetcher.data?.max_results} results`}
          >
            {fetcher.data?.content?.map(
              factor => (
               <FactorRow 
                  setUnitTypeValue={setUnitTypeValue}
                  unitTypeValue={unitTypeValue}
                  refreshResults={refreshResults}
                  saviorId={saviorId}
                  factor={factor}
                  chosenActivity={chosenActivity}
                  key={factor._id}
                  setChosenActivity={setChosenActivity}
                />
                )
              )}
          {fetcher.data &&
            <div className="pages">
              <span className="material-symbols-rounded pink-hov">first_page</span>
              <span className="material-symbols-rounded pink-hov">chevron_left</span>
              <span className="material-symbols-rounded pink-hov">chevron_right</span>
              <span className="material-symbols-rounded pink-hov">last_page</span>
            </div>
            }
          </DataTable>
        </div>
        : 
        <DataTable 
          columns={tableColumns} 
          className="factors"
          // title={`${fetcher.data?.max_results} results`}
        >
          {fetcher.data?.content?.map(
            factor => <FactorRow 
              refreshResults={refreshResults}
              factor={factor} 
              key={factor._id}
              saviorId={saviorId}
              setChosenActivity={returnFactor}
            />
            )}
          {fetcher.data &&
            <div className="pages">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <span 
                  className="material-symbols-rounded pink-hov" 
                >
                  first_page
                </span>
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                <span 
                  className="material-symbols-rounded pink-hov" 
                  >
                  chevron_left
                </span>
              </button>
              <button
                disabled = {currentPage >= calcLastPage()}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
              <span 
                className="material-symbols-rounded pink-hov"
                >
                chevron_right
              </span>
              </button>
              <button
                disabled = {currentPage >= calcLastPage()}
                onClick={() => setCurrentPage(calcLastPage())}
              >
                <span 
                  className="material-symbols-rounded pink-hov"
                  >
                  last_page
                </span>
              </button>
            </div>
            }
        </DataTable>
      }
    </div>
  )
})

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
            <p>
              {factor.description || "description here"}
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
            <div className="info">
              <span>keywords:</span>
              <span 
                style={{maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis"}}
              >
                {factor.keywords}
              </span>
            </div>
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

export default EmissionFactors