import { NavLink } from "react-router-dom";
import "./Section.css"
import { SectionProps } from "./types";

/**
 * A section of routes for `<DashboardRouter />`
 * 
 * @param props 
 * @param props.name - The name of this section.
 * @param props.icon - The name of the google material symbols icon to render.
 * @param props.pages array of strings containing the routes this section should render.
 * 
 */
export function Section({ name, icon, pages }: SectionProps) {

  return (
    <div className="section">
      <div className="title">
        <span className="material-symbols-rounded icon">{ icon }</span>
        <span className="name">{ name }</span>
      </div>
      <div className="pages">
        {
          pages.map((page) => (
            <NavLink key={page} className="page" to={page.toLowerCase().split(" ").join("-")} >
              { page }
              <span className="bg" />
              <span className="border" />
            </NavLink>
          ))
        }
      </div>
    </div>
  )
}