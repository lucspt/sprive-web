import { useReducer } from "react";
import { formatRequest } from "../../utils";

const getPlot = () => {
  request = formatRequest()
}

const reducer = (state, action) => {
  switch (action.type) {
    case "update_plot": {
      const { payload } = action;
      return {...state, [payload.name]: payload.value};
    }
  }
}


export default function Plots() {

  const [ state, dispatch ] = useReducer(reducer, {})

  return (
    <div className="plots">
      <div className="sidebar">
        <div className="choices">
          <div className="choice radio">
            <label htmlFor="plot_type">chart type</label>
            <div style={{"display": "flex"}}>
              <div className="field">
                <label htmlFor="pie">pie</label>
                <input name="plot_type" value="pie" type="radio"/>
              </div>
              <div className="field">
                <label htmlFor="bar">bar</label>
                <input name="plot_type" value="bar" type="radio"/>
              </div>
              <div className="field">
                <label htmlFor="line">line</label>
                <input name="plot_type" value="line" type="radio"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="plot">
        <div className="visualization">
          Welcome back, here is what needs to happen.
          We must make an interface where the savior can customize, create, and save 
          chart configurations possible even have them store as widgets on dashboard pages. 
          This will happen by forming an aggregation pipeline in js with a controlled field 
          and then sending it to python.
        </div>
        <div className="actions">Actions</div>
      </div>
    </div>
  )
}