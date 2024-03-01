import {  useNavigate } from "react-router-dom";
import RouteButton from "./RouteButton"
import { useContext, memo } from "react";
import { SaviorContext } from "../../contexts/SaviorContext";
import { isObjectEmpty, windowSize } from "../../utils";

const Branches = memo(function Branches() {
  const nav = useNavigate()
  const { savior } = useContext(SaviorContext)
  const isLoggedIn = !isObjectEmpty(savior)
  

  return (
    <div className={`branches ${windowSize}`}>
      {isLoggedIn ?
        <div className="branch router">
          <button className="toggle">
            <span 
              className="material-symbols-rounded"
            >
              dashboard
            </span>
        </button>
        <div className={`routes ${windowSize}`}>
          <RouteButton 
            route="dashboard" 
            navRoute="saviors/dashboard?section=overview"
            icon="dashboard"/>
          <RouteButton route="settings" navRoute="settings" icon="settings" />
        </div>
        </div>
        :
        <button className="crown-login" onClick={() => nav("/login")}>
          login
        </button>
      }
    </div>
  )
})

export default Branches