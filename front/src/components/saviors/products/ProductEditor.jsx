import { useReducer, useRef, useEffect, useState, useCallback } from "react"
import EmissionFactors from "../factors/EmissionFactors"
import { useFetcher, useLoaderData, useLocation, useNavigate } from "react-router-dom"
import { fetchData, formatCO2e } from "../../../utils"
import Visualization, { innerTextPlugin } from "../../Visualization"
import ValidatedInput from "../../ValidatedInput"
import "./ProductEditor.css"

const objectsEqual = (newObj, oldObj) => {
  return Object.keys(newObj).every(k => newObj[k] === oldObj[k]);
}

let pieCount = 0;
const getPieChart = (stages) => {
  if (stages?.some(x => x.co2e)) {
    
    const [ data, labels ] = [ [], [] ];
    stages.map(x => {
      data.push(x.co2e);
      labels.push(x.stage);
    })
    pieCount++
    return {
      "data": data.filter(x => x), 
      "labels": labels.filter(x => x),
      "renderChart": pieCount
    }
  } else return null;
}

export const productLoader = async ({ params }) => {

  const productId = params.productId
  const res = await fetchData(`saviors/products/${productId}`, "GET")
  return [res.content, productId]
}

const formToRequest = form => {
  form.preventDefault()
  let formData = new FormData(form.target)
  formData = Object.fromEntries(formData.entries())
  return formData
}

const reducer = (state, action) => {
  switch (action.type) { 
    case "set": return action.payload;
    case "update": return { ...state, ...action.payload  }
    case "switch_view": return { ...state, "currentView": action.payload }
    case "add_stage": {
      const { product, product :{ stages }} = state
      const { payload } = action 
      if (product.stages?.some(x => x.stage === payload.stage)) {
        return state
      }
        let withNew = stages ? [payload].concat(stages) : [payload]
        withNew = {...product, "stages": withNew}
        return {...state, "currentView": "product", "product": withNew,}
      }
    case "add_process": {
      const { addingToStage, product, product :{ stages }} = state
      const { payload } = action 
      const stage = stages[addingToStage]
      const processes = stage.processes
      const processUpdate = [...processes, payload]
      const update = {...stage, "processes": processUpdate}
      const newStages = [
        ...stages.slice(0, addingToStage), 
        update,
        ...stages.slice(addingToStage + 1),
      ]
      return {
        ...state, 
        "currentView": "product",
        "shouldCalculate": false,
        "shouldUpdate": true,
        "product": {
          ...product, 
          "stages": newStages
        },
        "fetchRequest": null 
      }
    }
    case "edit_process": {
      const { product, product :{ stages }} = state
      const { processToEdit, addingToStage, process: update } = action.payload
      const stage = stages[addingToStage]
      const process = stage.processes[processToEdit]
      const processUpdate = {...process, ...update}
      const { processes } = stage 
      const stageWithEdit = {
        ...stage, processes: [
          ...processes.slice(0, processToEdit),
          processUpdate, 
          ...processes.slice(processToEdit + 1)
        ]
      }
      const newStages = [
        ...stages.slice(0, addingToStage), 
        stageWithEdit,
        ...stages.slice(addingToStage + 1),
      ]
      // check if any co2e changing edits took place
      const { _id: _, co2e: __, activity: ___, ...oldProcess } = process 
      const { _id: n_, co2e: n__, activity: n___, ...newProcess } = processUpdate 
      let { activity_value: activityValue } = processUpdate
      activityValue = Number(activityValue)
      newProcess.activity_value = activityValue
      const shouldCalculate = !objectsEqual(newProcess, oldProcess)
      const { product_id } = product
      const res = {
        ...state,
        "shouldUpdate": true,
        "shouldCalculate": shouldCalculate,
        "product": {
          ...product, 
          "stages": newStages, 
        },
        "fetchRequest": () => {
          const { _id, ...edit } = processUpdate 
          if (_id) {
            return fetchData(`saviors/products/processes/${_id}`, "PUT", {
              ...edit,
              "activity_value": activityValue,
              "keywords": product.keywords,
              "stage": stage.stage,
              "name": product.name,
              "product_id": product_id,
              "calculate_emissions": shouldCalculate
            })
          } else {
            return fetchData(`saviors/products/processes`, "POST", {
              ...edit,
              "activity_value": activityValue,
              "keywords": product.keywords,
              "stage": stage.stage,
              "name": product.name,
              "product_id": product_id,
              "calculate_emissions": shouldCalculate
            })
          }
        }
      }
      return res
    }
    case "delete_process": {
      const { payload } = action 
      if (typeof payload === "function") { 
        // this means last stage and process, delete and navigate to product showcase
        const id = state.product.stages[0].processes[0]._id
        fetchData(`saviors/products/processes/${id}`, "DELETE")
        .then(res => res.json())
      return {
        ...state,
        "shouldUpdate": true,
        "shouldCalculate": false,
        "fetchRequest": () => payload(
          "../../dashboard?section=products", {replace: true}
        ) //navigate to products page
      } 
    } else {
        return {
          ...state, 
          "shouldCalculate": true,
          "shouldUpdate": true,
          "fetchRequest": () => fetchData(
            `saviors/products/processes/${payload.id}`, "DELETE"
          )
        }
      }
    }
    case "delete_product": {
      const { payload } = action 
      fetchData(`saviors/products/${payload.id}`, "DELETE")
      .then(res => res)
      return {
        ...state,
        "shouldUpdate": true,
        "shouldCalculate": false,
        "fetchRequest": () => payload.nav(
          "../../dashboard?section=products", {replace: true}
        ) //navigate to products page
      } 
    }
    case "handle_settings": {
      let { payload: { update, nav } } = action 
      return {
        ...state,
        "product": {...state.product, ...update},
        "shouldUpdate": false,
        "currentView": state.currentView.replace("settings", ""),
        "shouldCalculate": false,
        "fetchRequest": () => fetchData(
          `saviors/products/${state.product.product_id}`, "PATCH", update
        )
      }
    }
  }
}

const sortStages = (stages) => {
  return stages.sort((a, b) => {
    return new Date(b.last_updated) - new Date(a.last_updated)
  })
}

const ProductEditor = function ProductEditor() {
  const [ initialProduct, productId ] = useLoaderData()
  const [ pieChart, setPieChart ] = useState({})
  const loc = useLocation()
  const [ state, dispatch ] = useReducer(
    reducer, {
      product: {...loc.state, ...initialProduct, product_id: productId}, 
      currentView: "product", 
      "fetchRequest": null,
      "shouldUpdate": false,
      "pieChart": getPieChart(initialProduct.stages),
      "shouldCalculate": true
    }
  )
  const nav = useNavigate()
  const stickyRef = useRef()
  const fetcher = useFetcher()

  const writeChanges = useCallback(async () => {
    const { fetchRequest, shouldUpdate, shouldCalculate } = state 
    if (shouldUpdate) {
      await fetchRequest()
      const res = await fetchData(`saviors/products/${productId}`, "GET")
      const { content: product } = res 
      // product.name = product.name || productId
      if (product.name) {
        dispatch({type: "set", payload: {
          ...state, 
          "product": product, 
          "currentView": "product",
          "fetchRequest": null, 
          "shouldUpdate": false,
          "shouldCalculate": false
        }})
      }
      if (shouldCalculate) {
        const stages = product?.stages;
        setPieChart(() => stages ? getPieChart(stages) : {})
      }
    } else {
      fetchRequest()
    }
  }, [fetcher, state.product, state.fetchRequest])

  useEffect(() => {
    const { product } = state
    if (product?.stages) {
      setPieChart(getPieChart(product.stages))
    }
  }, [])
  
  useEffect(() => {
    if (state.fetchRequest) writeChanges();
  }, [state.fetchRequest])
  
  useEffect(() => console.log(state, "STATE"), [state])
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([ e ]) =>  e.intersectionRatio < 1
    )

      if (stickyRef.current) {
        observer.observe(stickyRef.current)
      }

      return () => observer.disconnect()
  }, [stickyRef])


  const { currentView, product } = state
  return (
    <div className="product-editor">
    <div 
      className="sidebar-grid" 
      style={{ gridTemplateColumns: state.currentView.includes("factors") ? "1fr" : "370px 1fr"}}
    >
      <div
        className="sidebar" 
        style={{ display: state.currentView.includes("factors") ? "none" : "grid"}}
      >
        <div className="heading">
            <span>{product.name || ""}</span>
          <span className={`rating ${product.rating || "B"}`}>{product.rating || "B"}</span>
        </div>
        <div className="actions">
          <button 
            className="default-btn view-factors"
            disabled={currentView.includes("add_stage")}
            onClick={() => dispatch({type: "switch_view", payload: [state.currentView, "add_stage"].join(" ")})}
          >
            add stage
          </button>
          <div className="product-stages sidebar-showcase">
            {currentView.includes("add_stage") && 
            <StageInserter 
              addStage={stage => dispatch({type: "add_stage", payload: stage})}
              close={
                () => dispatch({
                  type: "switch_view", 
                  payload: state.currentView.replace("add_stage", "")
                })
              }
              validation={product.stages}
            />
          }
            {product.stages && 
              sortStages(product.stages).map((stage, i) => (
              stage && 
                <ProductStage 
                stage={stage} 
                key={stage.stage} 
                showFactors={
                  () => dispatch({
                    type: "update", 
                    payload: {"currentView": "factors", addingToStage: i}
                  })
                  
                }
                editProcess={
                  action => dispatch({
                    ...action,
                    payload: {...action.payload, addingToStage: i}
                  })
                }
                deleteProcess={
                  id => dispatch({
                    "type": "delete_process", 
                    payload: {id: id, stageNum: i}
                  })
                }
                setWarnDeletion={
                  product.stages.length === 1 ? 
                  () => dispatch({
                    type: "switch_view", 
                    payload: [state.currentView, "warn_deletion"].join(" ")
                  }) : null
                }
                />
              ))}
          </div>
        </div>
        <div className="sidebar-bottom">
          <button 
            style={{ display: "flex" }}
            onClick={
              () => dispatch({
                type: "switch_view", 
                payload: [state.currentView, "settings"].join(" ")
              })
            }
          >
            <span className="material-symbols-rounded icon">settings</span>
          </button>
          <div className="scroll-indicator">
            <div className="mouse">
              <span className="material-symbols-rounded">expand_more</span>
              <span className="material-symbols-rounded">expand_more</span>
            </div>
          </div>
        <div className="delete">
          <button 
            className="pink-hov"
            style={{ textAlign: "end" }} 
            onClick={
              () => dispatch({
                type: "switch_view",
                payload: [state.currentView, "warn_deletion"].join(" ")})}
                >
            <span className="material-symbols-rounded">warning</span>
          </button>
        </div>
        </div>
      </div>
      <div className="editor-content">
    {currentView.includes("factors") ?
    <EmissionFactors 
      formNeedsSticky={true} 
      action="../../factors" 
      showUnitTypes={true}
      backButton={
        () => dispatch({
          type: "switch_view", 
          payload: state.currentView.replace("factors", "")
        }
      )}
      returnFactor={process => dispatch({type: "add_process", payload: process})}
    /> 
    : currentView.includes("product") && pieChart?.data &&
    <>
      <span style={{ width: "100%", textAlign: "center" }}>the product will go here!</span>
    <div className="product-right">
    <div className="pie-chart">
    <Visualization 
    id={product.name}
    key={pieChart.renderChart}
    type="doughnut"
    backgroundColor="#181b1f"
    labels={pieChart.labels}
    style={{width: 230, height: 230}}
    datasets={[{data: pieChart.data, label: "emissions"}]}
    options = {{
      plugins: {
        title: {
          display: true,
          text: "CO2e distribution",
          font: {
            size: 13,
          }
        },
        "legend": {
          "display": true,
          "align": "middle",
          "position": "bottom",
          "labels": {
            "boxWidth": 10,
            "boxHeight": 10,
            "font": {
              "size": 11.5
            }
          }
        },
      }
    }}
    plugins={[innerTextPlugin]}
    /> 
    </div>
    </div>
    </>
    }
      </div>
    </div>
    {currentView.includes("warn_deletion") ?
    <>
      <div className="popup container"
        onClick={
          () => dispatch({
            type: "switch_view",
            payload: state.currentView.replace("warn_deletion", "").replace("warnings", "") })
        }
      ></div>
        <div className="warning">
          <div className="top">
            <button style={{ display: "flex", cursor: "pointer" }} onClick={
              () => dispatch({
                type: "switch_view",
                payload: state.currentView.replace("warn_deletion", "")
              }
            )}
              >
              <span className="material-symbols-rounded">arrow_back</span>
            </button>
            <span>Are you sure you want to delete this product?</span>
          </div>
          <button 
            className="delete-product default-btn"
            onClick={() => dispatch({ type: "delete_product", payload: {nav: nav, id: productId}})}>
            yes
          </button>
      </div>
      </>
      :
      currentView.includes("settings") ?
      <>
        <div className="popup container" 
          onClick={
            () => dispatch({
              type: "switch_view", 
              payload: state.currentView.replace("settings", "")
            })
          }
          >
        </div>
          <div className="settings-popup">
              <form action={null} onSubmit={
                e => {
                  e.preventDefault();
                  dispatch({
                  type: "handle_settings",
                  payload: {"update": formToRequest(e), "nav": nav}})
                }}
              >
                <button 
                  className="back" 
                  type="button"
                  style={{ alignSelf: "flex-start", cursor: "pointer" }}
                  onClick={
                    () => dispatch({
                      type: "switch_view", 
                      payload: state.currentView.replace("settings", "")
                    })
                  }
                >
                  <span className="material-symbols-rounded">
                    arrow_back
                  </span>
                </button>
                <ValidatedInput 
                  name="name"
                  type="text"
                  message="you must provide a name!"
                  placeholder="product name"
                  defaultValue={product.name}
                  label="name"
                  style={{flexDirection: "column", maxWidth: "unset"}}
                  />
                  <div className="input-field" style={{ position: "relative", maxWidth: "unset" }}>
                  <textarea 
                    rows={7}
                    id="description"
                    defaultValue={product.keywords}
                    name="keywords"
                    required
                    placeholder="product description"
                    />
                    <span className="after">please provide a longer description!</span>
                    <label htmlFor="description">description</label>
                </div>
                <div className="submit">
                  <button 
                    type="submit" 
                    className="default-btn"
                  >
                    save
                  </button>
              </div>
              </form>
          </div>
        </>
        : currentView.includes("warnings") &&
        <>
        <div className="popup container"
              onClick={
                () => dispatch({
                  type: "switch_view",
                  payload: state.currentView.replace("warnings", " ")
                }) 
              }
          ></div>
        <div className="warning"
          style={{ alignItems: "flex-start", justifyContent: "unset"}}
        >
            <button 
              onClick={
                () => dispatch({
                  type: "switch_view",
                  payload: state.currentView.replace("warnings", " ")
                }) 
              }>
                <span className="material-symbols-rounded">arrow_back</span>
              </button>
            <button 
              className="popup-button"
              style={{ alignSelf: "center" }}
              onClick={
                () => dispatch({
                  type: "switch_view",
                  payload: [state.currentView, "warn_deletion"].join(" ")
                }) 
              }
            >
              <span className="material-symbols-rounded">delete</span>
              delete product
            </button>
        </div>
        </>
         }
  </div>
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

const ProductStage = ({ 
  stage, 
  showFactors, 
  editProcess, 
  deleteProcess,
  setWarnDeletion,
}) => {
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
              key={process._id}
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

const ProcessWidget = ({ process, editProcess, deleteProcess, setWarnDeletion }) => {
  const { co2e } = process
  const protectedDeletion = () => {
    setWarnDeletion ? setWarnDeletion() : deleteProcess(process._id)
  }

  return (
    <form 
      className="process item" 
      onSubmit={e => {editProcess(formToRequest(e))}}
      >
      <div className="heading">
        <ValidatedInput
          defaultValue={process.activity}
          name="activity"
          autoComplete="off"
          required 
          // onChange={e => e.target.style.width = `${e.target.value.length * 8}px`}
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

// {locked ?
//   <button tabIndex={0} 
//     type="button"
//     key="unlock"
//     onClick={() => {
//       inputRef.current.focus();
//       setLocked(false)
//     }}
//     >
//       <span className="material-symbols-rounded pink-hov">edit</span>
//     </button>
//     : 
//     <button tabIndex={0}
//       key="save"
//       className="save"
//       onClick={() => {
//         setLocked(true)
//         let formData = new FormData(formRef.current) 
//         formData = Object.fromEntries(formData.entries())
//         editProcess(formData)
//       }}
//     >
//       save
//   </button>
//   }

const applyUpdate = (addStage, e, validation) => {
  e.preventDefault()
  const stageName = e.target.elements["stage"]
  if (validation) {
    if (validation.some(x => x.stage === stageName.value)) {
      stageName.classList.add("unique-warn");
      return;
    }
  }
  let formData = new FormData(e.target)
  formData = Object.fromEntries(formData)
  formData.processes = [];
  addStage(formData)
}

const StageInserter = ({ addStage, close, validation }) => {

  return (
    <form onSubmit={e => applyUpdate(addStage, e, validation)}>
      <div className={`stage item`}>
      <div className="stage-info">
        <div className={`heading add`}>
          <ValidatedInput
            type="text"
            name="stage"
            placeholder="stage name" 
            onChange={e => e.target.classList.remove("unique-warn")}>
          <span className="warn">stage names should be unique</span>
          </ValidatedInput>
          <button 
            type="button"
            onClick={close}
          >
            <span className="material-symbols-rounded white-hov">close</span>
          </button>
        </div>
      </div>
      </div>
      <input type="submit" style={{display: "none"}} />
    </form>
  )
}

export default ProductEditor