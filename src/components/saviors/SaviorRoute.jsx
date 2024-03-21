import { memo, useContext } from "react";
import { SaviorContext } from "../../contexts/SaviorContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import "./SaviorRoute.css"
import DashboardRouter from "./sidebar/DashboardRouter";


const SaviorRoute = memo(function SaviorRoute() {
  const { isLoggedIn } = useContext(SaviorContext);
  const loc = useLocation();
  const splitPath = loc.pathname.split("/");
  const showRouter = !splitPath.includes("factors") && (splitPath.length - 1) < 3; 
  // this means it's not a nested route like process editor, cards, etc.
  const currentSection = showRouter ? splitPath.at(-1) : "";
  console.log(showRouter, !splitPath.includes("factors"));
  return isLoggedIn ? (
    <div 
      className={`dashboard-grid ${currentSection}`}
      style={{ 
        gridTemplateColumns: showRouter
        ? "minmax(var(--sidebar-width), 10vw) 1fr" 
        : "unset"
      }}
    >
      {showRouter && <DashboardRouter currentSection={currentSection}/> }
      <Outlet />
    </div>
    ) : <Navigate to="/" replace/>
})

export default SaviorRoute