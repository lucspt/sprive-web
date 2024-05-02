import { MouseEvent, useState } from "react"
import "./ExpandableScope.css";
import { formatCO2e } from "../../../utils/utils";
import { EmissionsTableAccordionProps } from "./types";

/**
 * A component that acts as an accordion which will either render 
 * a scope and it's categories / activities, or a GHG category and its 
 * activities.
 * 
 * @param props
 * @param props.children - children to render
 * @param props.title - The title of the accordion
 * @param props.co2e - The total emissions of this accordion's scope or GHG category.
 * @param props.onClick - Called when the accordion is clicked.
 * 
 * @returns The accordion component.
 */
export function EmissionsTableAccordion({ 
  children, 
  title, 
  className, 
  co2e,
  onClick=() => null,
 }: EmissionsTableAccordionProps) {
  const [ expanded, setExpanded ] = useState(false);
  const _onClick = (e: MouseEvent<HTMLDivElement>) => {
    onClick(e);
    setExpanded(prev => !prev);
  }

  return (
    <div 
      className={`scope-row ${className} border`} role="button"
      tabIndex={0}
      onClick={_onClick}
    >
    <div
      className="scope"
     >
      <div className="title">
        <span>{ title }</span>
        <div className="right">
          <span className="digit">{ formatCO2e(co2e, { maximumFractionDigits: 3 }) }</span>
          <span 
            className="material-symbols-rounded chevron"
            style={{ transform: expanded ? "rotate(-90deg)" : "rotate(0deg)"}}
            >
            chevron_right
          </span>
        </div>
      </div>
      <div style={{ display: expanded ? "block" : "none" }}>
        { children }
      </div>
    </div>
    </div>
  )
}