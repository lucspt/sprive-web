import { NavLink } from "react-router-dom"
export default RouteButton = ({ route, navRoute, icon }) => {
  if (windowSize !== "small") {
    return <NavLink to={navRoute}>{route}</NavLink>
  } else {
    return (
      <NavLink to={navRoute}>
        {route}
        <span className="material-symbols-rounded">{icon}</span>
      </NavLink>
    )
  }
}