import { NavLink, Route, useLocation, useNavigate } from "react-router-dom";
import Branch from "./Branch";
import { useContext, memo } from "react";
import { SaviorContext } from "../../contexts/SaviorContext";
import { isObjectEmpty, windowSize } from "../../utils";

const Branches = memo(function Branches() {
  const loc = useLocation()
  const nav = useNavigate()
  const { savior, logout } = useContext(SaviorContext)
  const isLoggedIn = !isObjectEmpty(savior)
  
  
  const RouteButton = ({ route, navRoute, icon }) => {
    // const routeButton = <button className="focus" onClick={() => nav(navRoute)}>{route}</button>
    const RouteElem = ({ children }) => <NavLink to={navRoute}>{route}{children}</NavLink>
    if (windowSize !== "small") {
      return <RouteElem />
    } else {
      return (
        <RouteElem>
          <span className="material-symbols-rounded">{icon}</span>
        </RouteElem>
      )
    }
  }

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