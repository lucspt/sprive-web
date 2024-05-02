import { memo, useContext } from "react";
import { SaviorContext } from "../../../contexts/savior/SaviorContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import "./SaviorRoute.css";
import "../../../styles/saviors.css";
import { DashboardRouter } from "../sidebar/DashboardRouter";
import { isLoggedIn } from "../../../utils/utils";
import { SaviorContextValues } from "../../../contexts/savior/types";

/**
 * All routes which are children of /saviors route are rendered as children of this component.
 * It implements an authorization requirement that checks if a user is logged in to their account,
 * and if their tokens are fresh enough to request with, only permitting continuing to the 
 * requested page if both are true. If not the request will be redirected to the home page /.
 * 
 * @returns The /saviors route wrapper.
 */
export const SaviorRoute = memo(function SaviorRoute() {
  const { savior } = useContext(SaviorContext) as SaviorContextValues;
  const loc = useLocation();
  const splitPath = loc.pathname.split("/");
  const showRouter = !splitPath.includes("factors") && (splitPath.length - 1) < 3; 


  return isLoggedIn(savior) ? (
    <div 
      className="dashboard-grid"
      style={{ 
        gridTemplateColumns: showRouter
          ? "minmax(var(--sidebar-width), 10vw) 1fr" 
          : "unset"
      }}
    >
      {showRouter && <DashboardRouter /> }
      <Outlet />
    </div>
    ) : <Navigate to="/" replace/>
});