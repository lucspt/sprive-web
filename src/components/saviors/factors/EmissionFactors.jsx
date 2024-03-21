import DataTable  from "../../DataTable"
import {  useFetcher, useLocation, useNavigate } from "react-router-dom"
import { fetchData, isObjectEmpty } from "../../../utils"
import { memo, useCallback, useContext, useEffect, useRef, useState } from "react"
import { SaviorContext } from "../../../contexts/SaviorContext";
import FileMapper from "./FileMapper";
import DropdownInput from "../../DropdownInput";
import FactorRow from "./FactorRow";
import "./EmissionFactors.css";
import PageSwitcher from "./PageSwitcher";

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
  const { state } = useLocation();
  const nav = useNavigate();
  const { savior: { savior_id: saviorId }} = useContext(SaviorContext);
  const fetcher = useFetcher({key: "emissionFactors"});
  const [ currentPage, setCurrentPage ] = useState(1);
  const [ chosenActivity, setChosenActivity ] = useState("");
  const [ queryBookmarks, setQueryBookmarks ] = useState("");
  const [ possibilities, setPossibilities ] = useState({});
  const [ unitTypeValue, setUnitTypeValue ] = useState(undefined);
  const formRef = useRef();

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

  useEffect(() => {
    if (isObjectEmpty(possibilities)) {
      fetchData(
        "factors/possibilities", "GET", {}, {}, setPossibilities
      );
    };
  }, []);

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
              values={possibilities.activity}
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
            values={possibilities.region}
          />
          <DropdownInput 
            label="unit type"
            submitOnEmpty={true}
            submitOnClick={true}
            id="unit type"
            placeholder="one factor.."
            values={possibilities.unit_types}
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
            values={possibilities.source}
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
           <div className="table-wrapper">
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
          </DataTable>
          {fetcher.data &&
            <div className="pages">
              <span className="material-symbols-rounded pink-hov">first_page</span>
              <span className="material-symbols-rounded pink-hov">chevron_left</span>
              <span className="material-symbols-rounded pink-hov">chevron_right</span>
              <span className="material-symbols-rounded pink-hov">last_page</span>
            </div>
            }
          </div>
        </div>
        : 
        <div>

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
        </DataTable>
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
        </div>
      }
    </div>
  )
})

export default EmissionFactors