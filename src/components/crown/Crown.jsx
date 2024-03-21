import { NavLink, useLocation } from "react-router-dom";
import { useContext, memo } from "react";
import { SaviorContext } from "../../contexts/SaviorContext";
import { windowSize } from "../../utils";
import "./Crown.css";
import MobileRouteButton from "./MobileRouteButton";

const Branches = memo(function Branches() {
  const loc = useLocation();
  const { isLoggedIn } = useContext(SaviorContext);

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
        <MobileRouteButton 
          route="dashboard" 
          navRoute="/saviors/overview"
          icon="dashboard"
        />
        <MobileRouteButton route="settings" navRoute="/saviors/settings" icon="settings" />
        </>
        :
        <>
          <div className="branch-routes">
          <NavLink to="ecosystem" className="white-hov">ecosystem</NavLink>
          {isLoggedIn ? 
          <NavLink to="/saviors/overview" className="white-hov">
            <span className="material-symbols-rounded">dashboard</span>
          </NavLink>
          : <NavLink to="login" className="white-hov" state={loc.pathname}>login</NavLink>
          }
        </div>
        </>
        }
    </div>
    </div>
  )
})

export default Branches