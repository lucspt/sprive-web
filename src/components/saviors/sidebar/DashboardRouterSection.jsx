import DashboardRouterLink from "./DashboardRouterLink";

export default function DashboardRouterSection({ sectionName, icon, children, }) {

  return (
    <div className="section">
    <div className="section-title">
      <span className="material-symbols-rounded">{ icon }</span>
      <span>{ sectionName }</span>
    </div>
    { children }
  </div>
  )
}