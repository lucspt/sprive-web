import { memo, useContext, useEffect, useReducer, useState } from "react";
import { useFetcher } from "react-router-dom"
import { SaviorContext } from "../../../contexts/SaviorContext";
import "./PlotVisualizer.css"
import { fetchData } from "../../../utils";
import Visualization, { innerTextPlugin } from "../../Visualization";

const CollectionBtn = ({ 
  collection, 
  className, 
  currentCollection, 
  switchCollection, 
  label=null,
}) => {
  return (  
    <button 
    disabled={currentCollection === collection}
    className={`collection ${currentCollection === collection} ${className}`}
    onClick={() => switchCollection(collection)}
    >
      <span>{label}</span>
    </button>
  )
}

const PlotTypeBtn = ({ currentPlot, icon, switchPlot, plotType }) => (
  <button className={`plot-type ${currentPlot.type === plotType}`}
    disabled={currentPlot.type === plotType}
    onClick={() => switchPlot(plotType)}
  >
    <span className="material-symbols-rounded">{icon}</span>
    <span className="label">{plotType}</span>
  </button>
)
const fetchToPlot = (fetchResult, plotInfo, opts) => {
  let data = Array.from(fetchResult, x => x.co2e)
  let labels;
  switch (plotInfo.type) {
    case "line": {
      labels = Array.from(
        fetchResult, x => Object.values(x._id).join("/")
      )
      break
    }
    case "doughnut": {
      labels = Array.from(fetchResult, x => x._id)
      break
    }
    case "bar": {
      labels = Array.from(fetchResult, x => x._id)
      break
    }
  }
  return {datasets: [{data: data, label: "CO2e", ...opts}], labels: labels}
}

function plotReducer(state, action) {
  switch (action.type) {
    case "switchPlot": {
      return {...state, type: action.payload, key: state.key + 1}
    }
    case "update": {
      return {
        ...state, 
        key: state.key + 1, 
        ...action.payload, 
      }
    }
    case "edit": {
      return {...state, ...action.payload}
    }
  }
}

const aggregationsReducer = (state, action) => {
  switch (action.type) {
    case "switchCollection": {
      return {...state, currentCollection: action.payload}
    }
    case "updateMatch": {
      const { payload, payload: { newMatch, plotType } } = action 
      const currentCollection = state.currentCollection
      const currentPlot = state[currentCollection][plotType]
      const filters = currentPlot.filters 
      console.log(filters, newMatch)
      Object.assign(filters[0]["$match"], newMatch)
      const res = {
        ...state,
        [currentCollection]: {
          ...state[currentCollection], 
          [plotType]: {...currentPlot, filters: filters}
        }
      }
      console.log(res)
      return res
    }
  }
}

const PlotVisualizer = memo(function PlotVisualizer() {
  const { savior: { savior_type } } = useContext(SaviorContext)
  const [ aggregation, dispatch ] = useReducer(aggregationsReducer, {
    logs: {
      line: {
        filters: [
          {"$match": {"co2e": {"$exists": true}}},
          {"$group": {
            "_id": {
                "month": {"$month": "$created"},
                "year": {"$year": "$created"},
            },
            "co2e": {"$sum": "$co2e"}
          },
        },
        {"$sort": {"_id.year": 1, "_id.month": 1}}
        ],
        query_type: "aggregate",
        collection: "logs",
      },
      doughnut: {
        filters: [
          {"$match": {"co2e": {"$exists": true}}},
          {
            "$group": {
              "_id": "$category",
              "co2e": {"$sum": "$co2e"},
            }
          }
        ],
        query_type: "aggregate",
        collection: "logs",
      },
      bar: {
        filters: [
            {"$match": {"co2e": {"$exists": true}}},
            {"$group": {
              "_id": "$category",
              "co2e": {"$sum": "$co2e"}
            },
          },
        ],
        query_type: "aggregate",
        collection: "logs",
      }
    },
    pledges: {
      line: {
        filters: [
          {"$match": {"co2e": {"$exists": true}}},
          {"$sort": {"created": 1}}
        ],
        query_type: "aggregate",
        collection: "pledges",
      }
    },
    products: {
      bar: {}
    },
    currentCollection: "logs"
    })
    const [ plot, plotDispatch ] = useReducer(plotReducer, {
      type: "line", 
      key: 0, 
      stacked: false,
      datasets: {},
      datasetOptions: {
        borderColor: "#1B4242",
        barThickness: 40,
      }
  })

  useEffect(() => {
    const getPlot = async () => {
      const res = await fetchData(
        "saviors/data", "POST", aggregation[aggregation.currentCollection][plot.type]
      )
      console.log(res, "reS")
      plotDispatch({
        type: "update",
        payload: fetchToPlot(
          res.content, 
          {type: plot.type, stacked: plot.stacked},
          plot.datasetOptions
        ),
      })
    }
    getPlot();
  }, [aggregation, plot.type])

  const switchCollection = collection => {
    dispatch({
      type: "switchCollection",
      payload: collection
    })
  }

  return (
    <div className="personal-plot sidebar-grid">
      <div 
        className="sidebar"
        // style={{ borderRightColor: "var(--soft-grey)" }}
      >
        <div className="collections button-row">
          <CollectionBtn 
            collection="logs" 
            label="emissions"
            className="first" 
            currentCollection={aggregation.currentCollection} 
            switchCollection={collection => switchCollection(collection)}
          />
          <CollectionBtn 
            collection="pledges"
            label="pledges"
            currentCollection={aggregation.currentCollection} 
            switchCollection={collection => switchCollection(collection)}
          />       
          {
            savior_type === "partners" && 
            <CollectionBtn 
              collection="products" 
              label="products"
              currentCollection={aggregation.currentCollection} 
              switchCollection={collection => switchCollection(collection)}
            />
          }
        </div>
        <div className="button-row plot-types">
          <PlotTypeBtn
            icon="donut_small" 
            plotType="doughnut"
            currentPlot={plot}
            switchPlot={plotType => plotDispatch({type: "switchPlot", payload: plotType})}
          />
          <PlotTypeBtn 
            icon="show_chart" 
            currentPlot={plot}
            switchPlot={plotType => plotDispatch({type: "switchPlot", payload: plotType})}
            plotType="line"
          />
          <PlotTypeBtn 
            icon="leaderboard"
            currentPlot={plot}
            switchPlot={plotType => plotDispatch({type: "switchPlot", payload: plotType})}
            plotType="bar"
          />
        </div>

        <PlotOptions 
          plotType={plot.type} 
          dispatch={dispatch}
          aggregation={aggregation}
          currentPlot={plot}
          plotDispatch={plotDispatch}
        />
      </div>

      <div className="plot content">
        {plot.datasets[0] && 
          <Visualization
          className="chart"
          // style={{ maxWidth: "30%", maxHeight: "50%", margin: "auto"}}
          id={[plot.type, plot.key].join("-")}
          type={plot.type}
          key={plot.key}
          options={{
            plugins: {
              legend: {
                position: "bottom",
                align: "center",
                padding: { top: 25 }
              }
            }
          }}
          labels={plot.labels}
          datasets={plot.datasets} 
          plugins={plot.type === "doughnut" ? [innerTextPlugin] : []}
          />
        }
      </div>
    </div>
  )
})

export default PlotVisualizer

const PlotOptions = ({ dispatch, plotType }) => {

  const [ date, setDate ] = useState({})

  const updateMatch = payload => {
    dispatch({
      type: "updateMatch", 
      payload: {newMatch: payload, plotType: plotType}
    })
  }

  useEffect(() => {console.log(date)}, [date])
  return (
    <div className="plot-options">
      <div className="dates option" style={{ gap: 20 }}>
        <div style={{ display: "flex", gap: 10 }}>
          <label htmlFor="start-date" className="option">
            start date
            <input 
              type="date" 
              id="start-date"
              max={date.$lt?.split("T")[0]}
              onChange={e => 
                  setDate(
                    prev => {
                      return {...prev, $gt: new Date(e.target.value).toJSON()}
                    }
                  )
              }
            />
          </label>
          <label htmlFor="start-date" className="option">
            end date
            <input 
              type="date" 
              id="end-date"
              min={date.$gt?.split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
              onChange={e => 
                setDate(
                  prev => {
                    return {...prev, $lt: new Date(e.target.value).toJSON()}
                  }
                )
              }
            />
          </label>
        </div>
        <button 
          type="button" 
          className="mini-submit default-btn"
          onClick={() => updateMatch({"created": date})}
          disabled={!(date.$gt, date.$lt)}
        >
          update
        </button>
      </div>
      {/* {currentPlot.type === "line" &&
        <button className={`stack option-button ${aggregation.line?.stacked}`} onClick={stackLineChart}>
        <span className="material-symbols-rounded">stacked_line_chart</span>
        fill lines
      </button>
      } */}
    </div>
  )
}