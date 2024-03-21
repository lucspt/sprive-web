import { useReducer, useRef, useEffect, useState, useCallback } from "react";
import EmissionFactors from "../../factors/EmissionFactors";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { fetchData, formToObj } from "../../../../utils";
import Visualization, { innerTextPlugin } from "../../../Visualization";
import ValidatedInput from "../../../ValidatedInput";
import "./ProductEditor.css";
import ProductStage from "./ProductStage";
import StageInserter from "./StageInserter";
import ProductCycle from "./ProductCycle";
import { memo } from "react";
import ProductCard from "../../../products/ProductCard";

export const _REQUIRED_STAGES = [
  "sourcing",
  "processing",
  "assembly",
  "transport",
];

export const getMissingProductStages = (productStages) => {
  const uniqueStages = Array.from(productStages, stage => stage.stage);
  const missingRequiredStages = _REQUIRED_STAGES.filter(
    x => !uniqueStages.includes(x)
  );
  const stagesWithoutCO2e = productStages.filter(x => x.processes?.length < 1);
  return [...missingRequiredStages, ...stagesWithoutCO2e];
}

const objectsEqual = (newObj, oldObj) => {
  return Object.keys(newObj).every(k => newObj[k] === oldObj[k]);
}

let pieCount = 0;
const getPieChart = (stages) => {
  const stagesWithCo2e = stages?.filter(x => x.co2e);
  if (!stagesWithCo2e) return;
  else if (stagesWithCo2e.length > 0) {
    const [ data, labels ] = [ [], [] ];
    stagesWithCo2e.map(x => {
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
  
  const productId = params.productId;
  const res = await fetchData(`saviors/products/${productId}`, "GET");
  // return [res.content, productId];
  return res.content;
}

const sortStagesByDate = (stages) => {
  return stages.sort((a, b) => {
    return new Date(b.last_updated) - new Date(a.last_updated);
  });
}

const addRequiredStages = (stages) => {
  const uniqueStages = Array.from(stages, stage => stage.stage);
  const missingRequiredStages = _REQUIRED_STAGES.filter(
    x => !uniqueStages.includes(x)
  ).map(
    missingStage => ({stage: missingStage, processes: [], num_processes: 0})
  );
  const allStages = [...stages, ...missingRequiredStages];
  const [ stagesNotRequired, stagesRequired ] = [ [], [] ];
  allStages.map(x => {
      if (_REQUIRED_STAGES.includes(x.stage)) {
        stagesRequired.push(x);
      } else stagesNotRequired.push(x);
  })
  return [
    ...stagesRequired.sort(
      (a, b) => _REQUIRED_STAGES.indexOf(a.stage) - _REQUIRED_STAGES.indexOf(b.stage)
    ),
    ...sortStagesByDate(stagesNotRequired)
  ]
}

const reducer = (state, action) => {
  switch (action.type) { 
    case "set": {
      const { payload, payload: { product } } = action
      return {
        ...payload,
        product: {
          ...product,
          stages: addRequiredStages(product.stages)
        }
      }
    };
    case "update": return { ...state, ...action.payload  };
    case "switch_view": return { ...state, "currentView": action.payload };
    case "add_stage": {
      const { product, product :{ stages }} = state;
      const { payload } = action ;
      if (product.stages?.some(x => x.stage === payload.stage)) {
        return state;
      }
        let withNew = stages ? [payload].concat(stages) : [payload];
        withNew = {...product, "stages": addRequiredStages(withNew)};
        return {...state, "currentView": "product", "product": withNew,};
      }
    case "add_process": {
      const { addingToStage, product, product :{ stages }} = state;
      const { payload } = action ;
      const stage = stages[addingToStage];
      const processes = stage.processes;
      const processUpdate = [...processes, payload];
      const update = {...stage, "processes": processUpdate};
      const newStages = [
        ...stages.slice(0, addingToStage), 
        update,
        ...stages.slice(addingToStage + 1),
      ];
      return {
        ...state, 
        "currentView": "product",
        "shouldCalculate": false,
        "shouldUpdate": true,
        "product": {
          ...product, 
          "stages": addRequiredStages(newStages)
        },
        "fetchRequest": null 
      };
    }
    case "edit_process": {
      const { product, product :{ stages }} = state;
      const { processToEdit, addingToStage, process: update } = action.payload;
      const stage = stages[addingToStage];
      const process = stage.processes[processToEdit];
      const processUpdate = {...process, ...update};
      const { processes } = stage ;
      const stageWithEdit = {
        ...stage, processes: [
          ...processes.slice(0, processToEdit),
          processUpdate, 
          ...processes.slice(processToEdit + 1)
        ]
      };
      const newStages = [
        ...stages.slice(0, addingToStage), 
        stageWithEdit,
        ...stages.slice(addingToStage + 1),
      ];
      // check if any co2e changing edits took place
      const { _id: _, co2e: __, activity: ___, ...oldProcess } = process; 
      const { _id: n_, co2e: n__, activity: n___, ...newProcess } = processUpdate; 
      let { activity_value: activityValue } = processUpdate;
      activityValue = Number(activityValue);
      newProcess.activity_value = activityValue;
      const shouldCalculate = !objectsEqual(newProcess, oldProcess);
      const { product_id } = product;
      console.log(addRequiredStages(newStages), "adding here");
      const res = {
        ...state,
        "shouldUpdate": true,
        "shouldCalculate": shouldCalculate,
        "product": {
          ...product, 
          "stages": addRequiredStages(newStages), 
        },
        "fetchRequest": () => {
          const { _id, ...edit } = processUpdate;
          if (_id) {
            return fetchData(`saviors/products/processes/${_id}`, "PUT", {
              ...edit,
              "activity_value": activityValue,
              "keywords": product.keywords,
              "stage": stage.stage,
              "name": product.name,
              "product_id": product_id,
              "calculate_emissions": shouldCalculate
            });
          } else {
            return fetchData(`saviors/products/processes`, "POST", {
              ...edit,
              "activity_value": activityValue,
              "keywords": product.keywords,
              "stage": stage.stage,
              "name": product.name,
              "product_id": product_id,
              "calculate_emissions": shouldCalculate
            });
          }
        }
      };
      return res;
    }
    case "delete_process": {
      const { payload } = action ;
      if (typeof payload === "function") { 
        // this means last stage and process, delete and navigate to product showcase
        const id = state.product.stages[0].processes[0]._id;
        fetchData(`saviors/products/processes/${id}`, "DELETE")
        .then(res => res.json());
      return {
        ...state,
        "shouldUpdate": true,
        "shouldCalculate": false,
        "fetchRequest": () => payload(
          "../../products", {replace: true}
        ) //navigate to products page
      }
    } else {
        return {
          ...state, 
          "shouldCalculate": true,
          "shouldUpdate": true,
          "fetchRequest": () => fetchData(
            `saviors/products/processes/${payload}`, "DELETE"
          )
        };
      }
    }
    case "delete_product": {
      const { payload } = action; 
      fetchData(`saviors/products/${payload.id}`, "DELETE")
      .then(res => res)
      return {
        ...state,
        "shouldUpdate": true,
        "shouldCalculate": false,
        "fetchRequest": () => payload.nav(
          "../../products", {replace: true}
        ) //navigate to products page
      }; 
    }
    case "handle_settings": {
      let { payload: { update, nav } } = action ;
      return {
        ...state,
        "product": {...state.product, ...update},
        "shouldUpdate": false,
        "currentView": state.currentView.replace("settings", ""),
        "shouldCalculate": false,
        "fetchRequest": () => fetchData(
          `saviors/products/${state.product.product_id}`, "PATCH", update
        )
      };
    }
  }
}

// export default ProductEditor
// const ProductEditor = function ProductEditor() {
//   // const [ initialProduct, productId ] = useLoaderData();
//   const initialProduct = useLoaderData();
//   const { product_id: productId } = initialProduct;
//   const [ pieChart, setPieChart ] = useState({});
//   const loc = useLocation();
//   const { stages: initialStages } = initialProduct;
//   const [ state, dispatch ] = useReducer(
//     reducer, {
//       product: {
//         ...loc.state,
//         ...initialProduct,
//         stages: addRequiredStages(initialStages || []), 
//         product_id: productId
//       }, 
//       currentView: "product", 
//       "fetchRequest": null,
//       "shouldUpdate": false,
//       "pieChart": getPieChart(initialStages),
//       "shouldCalculate": true
//     }
//   );
//   const nav = useNavigate();
//   const stickyRef = useRef();

//   const writeChanges = useCallback(async () => {
//     const { fetchRequest, shouldUpdate, shouldCalculate } = state; 
//     if (shouldUpdate) {
//       await fetchRequest();
//       const res = await fetchData(`saviors/products/${productId}`, "GET");
//       const { content: product } = res; 
//       if (product.name) {
//         dispatch({type: "set", payload: {
//           ...state, 
//           "product": product, 
//           "currentView": "product",
//           "fetchRequest": null, 
//           "shouldUpdate": false,
//           "shouldCalculate": false
//         }});
//       }
//       if (shouldCalculate) {
//         const stages = product?.stages;
//         setPieChart(() => stages ? getPieChart(stages) : {});
//       }
//     } else {
//       fetchRequest();
//     }
//   }, [state.product, state.fetchRequest]);

//   useEffect(() => {
//     const { product } = state;
//     if (product?.stages) {
//       setPieChart(getPieChart(product.stages));
//     }
//   }, [])
  
//   useEffect(() => {
//     if (state.fetchRequest) writeChanges();
//   }, [state.fetchRequest]);
  
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([ e ]) =>  e.intersectionRatio < 1
//     )

//       if (stickyRef.current) {
//         observer.observe(stickyRef.current);
//       }

//       return () => observer.disconnect();
//   }, [stickyRef]);

//   const { currentView, product } = state;

//   return (
//     <div className="product-editor">
//     <div 
//       className="sidebar-grid" 
//       style={{ 
//           gridTemplateColumns: 
//           state.currentView.includes("factors") 
//             ? "1fr" 
//             : "370px 1fr"
//         }}
//     >
//       <div
//         className="sidebar" 
//         style={{ display: state.currentView.includes("factors") ? "none" : "grid"}}
//       >
//         <div className="heading">
//           <div className="name">
//             <span>{product.name || ""}</span>
//             <span 
//             className="material-symbols-rounded pink-hov" 
//             style={{cursor: "pointer"}}
//             onClick={() => nav(`../${productId}`)}>
//               book
//             </span>
//           </div>
//           <span className={`rating ${product.rating || "B"}`}>{product.rating || "B"}</span>
//         </div>
//         <div className="actions">
//           <div className="product-stages sidebar-showcase">
//             {currentView.includes("add_stage") && 
//             <StageInserter 
//               addStage={stage => dispatch({type: "add_stage", payload: stage})}
//               close={
//                 () => dispatch({
//                   type: "switch_view", 
//                   payload: state.currentView.replace("add_stage", "")
//                 })
//               }
//               validation={product.stages}
//             />
//           }
//             { product?.stages.map((stage, i) => (
//               stage && 
//                 <ProductStage 
//                 stage={stage} 
//                 key={stage.stage} 
//                 showFactors={
//                   () => dispatch({
//                     type: "update", 
//                     payload: {"currentView": "factors", addingToStage: i}
//                   })
                  
//                 }
//                 editProcess={
//                   action => dispatch({
//                     ...action,
//                     payload: {...action.payload, addingToStage: i}
//                   })
//                 }
//                 deleteProcess={
//                   id => dispatch({
//                     "type": "delete_process", 
//                     payload: id,
//                   })
//                 }
//                 setWarnDeletion={
//                   product.stages.length === 1 ? 
//                   () => dispatch({
//                     type: "switch_view", 
//                     payload: [state.currentView, "warn_deletion"].join(" ")
//                   }) : null
//                 }
//                 />
//               ))}
//           </div>
//         </div>
//         <div className="sidebar-bottom">
//           <button 
//             style={{ display: "flex" }}
//             onClick={
//               () => dispatch({
//                 type: "switch_view", 
//                 payload: [state.currentView, "settings"].join(" ")
//               })
//             }
//           >
//             <span className="material-symbols-rounded icon">settings</span>
//           </button>
//           <div className="scroll-indicator">
//             <div className="mouse">
//               <span className="material-symbols-rounded">expand_more</span>
//               <span className="material-symbols-rounded">expand_more</span>
//             </div>
//           </div>
//         <div className="delete">
//           <button 
//             className="pink-hov"
//             style={{ textAlign: "end" }} 
//             onClick={
//               () => dispatch({
//                 type: "switch_view",
//                 payload: [state.currentView, "warn_deletion"].join(" ")})}
//                 >
//             <span className="material-symbols-rounded">warning</span>
//           </button>
//         </div>
//         </div>
//       </div>
//       <div className="editor-content">
//     {currentView.includes("factors") ?
//     <EmissionFactors 
//       formNeedsSticky={true} 
//       action="../../factors" 
//       showUnitTypes={true}
//       backButton={
//         () => dispatch({
//           type: "switch_view", 
//           payload: state.currentView.replace("factors", "")
//         }
//       )}
//       returnFactor={process => dispatch({type: "add_process", payload: process})}
//     /> 
//     : currentView.includes("product") &&
//     <>
//       <ProductCard />
//     {pieChart?.data && 
//       <div className="product-right">
//         <div className="pie-chart">
//           <Visualization 
//             id={product.name}
//             key={pieChart.renderChart}
//             type="doughnut"
//             backgroundColor="#181b1f"
//             labels={pieChart.labels}
//             style={{width: 230, height: 230}}
//             datasets={[{data: pieChart.data, label: "emissions"}]}
//             options = {{
//               plugins: {
//                 title: {
//                   display: true,
//                   text: "CO2e distribution",
//                   font: {
//                     size: 13,
//                   }
//                 },
//                 "legend": {
//                   "display": true,
//                   "align": "middle",
//                   "position": "bottom",
//                   "labels": {
//                     "boxWidth": 10,
//                     "boxHeight": 10,
//                     "font": {
//                       "size": 11.5
//                     }
//                   }
//                 },
//               }
//             }}
//             plugins={[innerTextPlugin]}
//           /> 
//         </div>
//       </div>
//     }
//     </>
//     }
//       </div>
//     </div>
//     {currentView.includes("warn_deletion") ?
//     <>
//       <div className="popup container"
//         onClick={
//           () => dispatch({
//             type: "switch_view",
//             payload: state.currentView.replace("warn_deletion", "").replace("warnings", "") })
//         }
//       ></div>
//         <div className="warning">
//           <div className="top">
//             <button style={{ display: "flex", cursor: "pointer" }} onClick={
//               () => dispatch({
//                 type: "switch_view",
//                 payload: state.currentView.replace("warn_deletion", "")
//               }
//             )}
//               >
//               <span className="material-symbols-rounded">arrow_back</span>
//             </button>
//             <span>Are you sure you want to delete this product?</span>
//           </div>
//           <button 
//             className="delete-product default-btn"
//             onClick={() => dispatch({ type: "delete_product", payload: {nav: nav, id: productId}})}>
//             yes
//           </button>
//       </div>
//       </>
//       :
//       currentView.includes("settings") ?
//       <>
//         <div className="popup container" 
//           onClick={
//             () => dispatch({
//               type: "switch_view", 
//               payload: state.currentView.replace("settings", "")
//             })
//           }
//           >
//         </div>
//           <div className="settings-popup">
//               <form action={null} onSubmit={
//                 e => {
//                   e.preventDefault();
//                   dispatch({
//                   type: "handle_settings",
//                   payload: {"update": formToObj(e.target), "nav": nav}})
//                 }}
//               >
//                 <button 
//                   className="back" 
//                   type="button"
//                   style={{ alignSelf: "flex-start", cursor: "pointer" }}
//                   onClick={
//                     () => dispatch({
//                       type: "switch_view", 
//                       payload: state.currentView.replace("settings", "")
//                     })
//                   }
//                 >
//                   <span className="material-symbols-rounded">
//                     arrow_back
//                   </span>
//                 </button>
//                 <ValidatedInput 
//                   name="name"
//                   type="text"
//                   message="you must provide a name!"
//                   placeholder="product name"
//                   defaultValue={product.name}
//                   label="name"
//                   style={{flexDirection: "column", maxWidth: "unset"}}
//                   />
//                   <div className="input-field" style={{ position: "relative", maxWidth: "unset" }}>
//                   <textarea 
//                     rows={7}
//                     id="description"
//                     defaultValue={product.keywords}
//                     name="keywords"
//                     required
//                     placeholder="product description"
//                     />
//                     <span className="after">please provide a longer description!</span>
//                     <label htmlFor="description">description</label>
//                 </div>
//                 <div className="submit">
//                   <button 
//                     type="submit" 
//                     className="default-btn"
//                   >
//                     save
//                   </button>
//               </div>
//               </form>
//           </div>
//         </>
//         : currentView.includes("warnings") &&
//         <>
//         <div className="popup container"
//               onClick={
//                 () => dispatch({
//                   type: "switch_view",
//                   payload: state.currentView.replace("warnings", " ")
//                 }) 
//               }
//           ></div>
//         <div className="warning"
//           style={{ alignItems: "flex-start", justifyContent: "unset"}}
//         >
//             <button 
//               onClick={
//                 () => dispatch({
//                   type: "switch_view",
//                   payload: state.currentView.replace("warnings", " ")
//                 }) 
//               }>
//                 <span className="material-symbols-rounded">arrow_back</span>
//               </button>
//             <button 
//               className="popup-button"
//               style={{ alignSelf: "center" }}
//               onClick={
//                 () => dispatch({
//                   type: "switch_view",
//                   payload: [state.currentView, "warn_deletion"].join(" ")
//                 }) 
//               }
//             >
//               <span className="material-symbols-rounded">delete</span>
//               delete product
//             </button>
//         </div>
//         </>
//          }
//   </div>
//   )
// }
// export default ProductEditor