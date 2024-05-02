import { Link } from "react-router-dom"
import "./DashboardRouter.css"
import { Section } from "./Section"
import { CurrentUser } from "./CurrentUser"


/**
 * The app's sidebar displayed on a /saviors route. Navigates different dashboard pages.
 * 
 * @returns The /saviors routes dashboard router / sidebar.
 */
export function DashboardRouter() {

  return (
    <div className="dashboard-router">
      <div>
        <Link to="/" className="top">
          Sprive
          <span className="material-symbols-rounded">open_in_new</span>
        </Link>
      </div>
      <div className="dashboard-routes">
        <Section 
          name="Journey" 
          icon="timeline"
          pages={[
            "Timeline",
            "Tasks"
          ]}
        />
        <Section 
          name="Footprint"
          icon="footprint"
          pages={[
            "Overview",
            "Emissions",
            "Supply chain",
            "Reductions",
            "Products",
          ]}
          />
          <Section
            name="Company"
            icon="domain"
            pages={[
              "Teams",
            ]}
          />
      </div>
      <CurrentUser />
    </div>
  )
}