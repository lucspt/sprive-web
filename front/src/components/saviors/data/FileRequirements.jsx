import { useLocation, useNavigate } from "react-router-dom"


export default function FileRequirements() {
  const nav = useNavigate();
  const { state } = useLocation();

  return (
    <>
      <div className="requirements top" style={{marginTop: 30}}>
        <button 
          className="back white-hov"
          onClick={() => nav(state || -1)}
          >
          <span className="material-symbols-rounded">arrow_back</span>
        </button>
      </div>
      <div className="container">
        <div className="requirements">
          <div className="example table">
          <span style={{fontSize: "1.3em"}}>example row:</span>
            <div className="row headers">
              <span>name</span>
              <span>value</span>
              <span>category</span>
              <span>unit</span>
              <span>unit type</span>
            </div>
            <div className="row">
              <span>energy consumption</span>
              <span>1000</span>
              <span>utilities</span>
              <span>usd</span>
              <span>money</span>
            </div>
          </div>
          <div className="columns">
            <span>required columns:</span>
            <ul>
              <li><span>name</span>: can be anything that helps you to distinguish the activity</li>
              <li><span>value</span>: denotes the amount of the activity done, with respect to it's unit</li>
              <li><span>category</span>: refers to the activity's category, e.g. manufacturing</li>
              <li><span>unit</span>: is the value's unit</li>
              <li><span>unit type</span>: is the metric of the value. this must be a valid metric, <a>see here</a></li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}