import { MouseEvent, useState } from "react";
import "./ScopeThreeCategory.css";
import { EmissionsTableAccordion } from "./EmissionsTableAccordion";
import { GHG_CATEGORY_NAMES } from "../../../constants";
import { ScopeThreeCategoryProps } from "./types";

/**
 * A scope 3 category accordion, uses `<EmissionsTableAccordion />`
 * to render an accordion with all of the given category's activities 
 * and their imapcts.
 * 
 * @param props
 * @param props.ghgCategory - The GHG category.
 * @param props.logs - The logs of this GHG category.
 * @param props.onExpand - The function to call when this accordion is requested to open.
 * @param props.onCollapse - The function to call when this accordion is requested to close.
 * @param props.renderActivity - A function that will render the relevant `<ScopeActivity />`. 
 * @param props.co2e - The total CO2e of this GHG category.
 * @returns The category accordion.
 */
export function ScopeThreeCategory({ 
  ghgCategory, 
  logs, 
  renderActivity,
  co2e
 }: ScopeThreeCategoryProps) {

  const [ expanded, setExpanded ] = useState(false);

  function onClick(e: MouseEvent<HTMLElement>) {
    e.stopPropagation();
    if (expanded) {
      setExpanded(false);
      // onCollapse();
    } else {
      setExpanded(true);
      // onExpand(logs.length + 1);
    }
  };
  
  return logs && (
      <EmissionsTableAccordion
        co2e={co2e}
        title={`GHG category: ${ghgCategory}: ${GHG_CATEGORY_NAMES[ghgCategory]}`}
        className="category"
        onClick={onClick}
      >
        {logs.map(renderActivity)}
    </EmissionsTableAccordion>
  )
}