import { NavLink } from "react-router-dom";

export default function RouteButton({ route, navRoute, icon }) {
  return (
    <NavLink to={navRoute}>
      {route}
      <span className="material-symbols-rounded">{icon}</span>
    </NavLink>
    )
  }