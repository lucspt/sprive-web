import { memo, useContext } from "react";
import { SaviorContext } from "../../contexts/SaviorContext";
import {  windowSize } from "../../utils";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import DashboardRouter from "./DashboardRouter";
import "./SaviorRoutes.css"


const SaviorRoutes = memo(function ProtectedRoutes() {
  const { isLoggedIn } = useContext(SaviorContext);
  const loc = useLocation();
  const dashboardSections = ["overview", "emissions", "pledges", "products", "suppliers"];
  
  const currentSection = loc.pathname.split("/").at(-1)
  return isLoggedIn 
  ? (     
      <div 
        className={`dashboard-container ${currentSection}`}
      >
        {
        dashboardSections.some(x => x === currentSection) && 
          <DashboardRouter currentSection={currentSection}/>
        }
        <div className={`dashboard ${windowSize} ${currentSection}`}>
          <Outlet />
        </div>
      </div>
    )
  : <Navigate to="/" replace/>
})

export default SaviorRoutes