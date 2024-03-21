import { NavLink } from "react-router-dom";
import "./DashboardRouterLink.css"

export default function DashboardRouterLink({ to, linkText, currentSection, icon, ...props}) {

  return (
      <NavLink to={to} className="dashboard-route">
        <span className="material-symbols-rounded">{ icon }</span>
        { linkText || to }
        </NavLink>
  )
}