import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useContext, memo } from "react";
import { SaviorContext } from "../../contexts/SaviorContext";
import { windowSize } from "../../utils";

const Branches = memo(function Branches() {
  const loc = useLocation()
  const { isLoggedIn } = useContext(SaviorContext)
  
  
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

  const includesSavior = loc.pathname.includes("savior")
  return (
    <div className={`crown ${windowSize}`}
      style={{ justifyContent: includesSavior ? "space-between" : "flex-end" }}
    >
      {includesSavior && windowSize !== "small" && 
      <NavLink 
        to="/" 
        className="white-hov"
      >
        <span id="sprive">sprive</span>
        <span className="material-symbols-rounded">open_in_new</span>
      </NavLink>
        }
      <div className={`branches ${windowSize}`}>
        {windowSize === "small" ? 
        <>
        <RouteButton 
          route="dashboard" 
          navRoute="saviors/dashboard?section=overview"
          icon="dashboard"
        />
        <RouteButton route="settings" navRoute="./saviors/settings" icon="settings" />
        </>
        :
        <>
        {
          includesSavior ? 
          <div className="branch-routes">
            <NavLink 
              to="/saviors/dashboard?section=overview"
              className="white-hov"
            >
                dashboard
            </NavLink>
            <NavLink to="/saviors/data" className="white-hov">data</NavLink>
            <NavLink to="/saviors/factors" className="white-hov">factors</NavLink>
            <NavLink to="/saviors/settings" className="white-hov">settings</NavLink>
          </div> 
        :
          <div className="branch-routes">
          <NavLink to="shop" className="white-hov">shop</NavLink>
          <NavLink to="ecosystem" className="white-hov">ecosystem</NavLink>
          {isLoggedIn ? 
          <NavLink to="/saviors/dashboard?section=overview" className="white-hov">
            <span className="material-symbols-rounded">dashboard</span>
          </NavLink>
          : <NavLink to="login" className="white-hov" state={loc.pathname}>login</NavLink>
          }
        </div>
          }
        </>
        }
    </div>
    </div>
  )
})

export default Branches