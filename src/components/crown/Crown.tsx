import { NavLink, useLocation } from "react-router-dom";
import { useContext, memo } from "react";
import { SaviorContext } from "../../contexts/savior/SaviorContext";
import { isLoggedIn } from "../../utils/utils";
import "./Crown.css";
import { SaviorContextValues } from "../../contexts/savior/types";

/**
 * Renders the topbar of routes which are not children of the /saviors route. 
 */
export const Crown = memo(function Crown() {
  const { savior } = useContext(SaviorContext) as SaviorContextValues;
  const loc = useLocation();
  const includesSavior = loc.pathname.includes("savior")
  
  return !includesSavior && (
    <div className="crown">
      <div className="branches">
        <div className="branch-routes">
          <NavLink to="ecosystem" className="white-hov" role="link" aria-label="the ecosystem">Ecosystem</NavLink>
          {
            isLoggedIn(savior) 
              ? <NavLink to="/saviors/overview" className="white-hov" role="link">
                  <span className="material-symbols-rounded">dashboard</span>
                </NavLink>
              : <NavLink 
                  to="login" 
                  className="white-hov" 
                  state={loc.pathname} 
                  role="link" 
                  aria-label="login"
                >
                  Login
                </NavLink>
          }
        </div>
    </div>
    </div>
  )
})