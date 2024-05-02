import { Link } from "react-router-dom";
import { Header } from "../header/Header";
import { NoDataProps } from "./types";


/**
 * A fallback component to use when the savior is on a page,
 * but has no relevant data to render
 * 
 * Renders a button-looking link that acts as a CTA to create the missing data.
 * 
 * @param props 
 * @param title - The most prevalant header to render with this component
 * @param subtitle - A smaller subtitle, goes under header.
 * @param linkTo - The `to` prop to pass to a react-router `<Link />`
 * @param linkText - The link's text
 * @returns React component
 */
export function NoData({ 
  title="No data recorded yet",
  subtitle="Get started with your first measurements",
  linkTo="/saviors/tasks",
  linkText="Measure"
 }: NoDataProps) {

  return (
    <div className="no-data">
      <Header text={title} fontSize="lg" />
      <p className="subtitle">{ subtitle }</p>
      <Link to={linkTo} className="default-btn xl">{ linkText }</Link>
    </div>
  )
}