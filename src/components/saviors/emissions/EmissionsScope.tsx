import { ScopeThreeCategory } from "./ScopeThreeCategory";
import { EmissionsTableAccordion } from "./EmissionsTableAccordion";
import { memo } from "react";
import { EmissionsPageLog, EmissionsScopeProps } from "./types";
import { GHGCategory } from "../../../types";

/**
 * Renders the parent component of a scope accordion, 
 * which contains either more accordions of GHG categories if scope is 3,
 * otherwise the scopes activities.
 * 
 * @param props
 * @param props.scope -  The scope being rendered.
 * @param props.logs - The logs of the scope.
 * @param isScopeThree - Whether scope is 3 or not.
 * @param props.setActivityModal - The state setter function to set the modal 
 * which renders an activity to `true`.
 * @param props.renderActivity - A function to render an activity when scope isn't 3
 * @param co2e - The emissions of this scope.
 */
export const EmissionsScope = memo(function EmissionsScope({ 
  scope, 
  logs, 
  isScopeThree, 
  renderActivity,
  co2e,
 }: EmissionsScopeProps) {

  return (
   <EmissionsTableAccordion title={`Scope ${scope}`} co2e={co2e}>
      <div className="logs">
        {isScopeThree 
          ? Object.entries(logs).map(([ ghgCategory, categoryData ]) => (
            <ScopeThreeCategory 
              ghgCategory={ghgCategory as GHGCategory} 
              logs={categoryData.logs as EmissionsPageLog[]} 
              co2e={categoryData.totalCO2e}
              key={ghgCategory}
              renderActivity={renderActivity}
            />
            ))
            : Array.isArray(logs) && logs?.map(renderActivity)
          }
      </div>
    </EmissionsTableAccordion>
  )
})