import { MouseEvent } from "react";
import { formatCO2e } from "../../../utils/utils";
import "./ScopeActivity.css";
import { ScopeActivityProps } from "./types";

/**
 * Renders an activity row for useage by the `<EmissionsByTable />` component.
 * On click a modal is rendered to display more info about this activity's
 * impact on the savior's logs.
 * 
 * @param props 
 * @param props.activity - The activity.
 * @param props.value - The summed value of this activity, given the savior's logs.
 * @param props.unit - The unit of this activity's logs.
 * @param props.co2e - The co2e caused by this activity. 
 * @param props.unitType - The unit type of this activity.
 * @param props.sourceFiles - The files uploaded the logs containing this activity.
 * @param props.region - The region of this activity's emission factor.
 * @param setModal - A function that will set a modal to render, 
 * which takes this rendered activity's data as it's child content.
 * @returns The activity component.
 */
export function ScopeActivity({ 
  activity, 
  value, 
  unit, 
  co2e, 
  unitType,
  sourceFiles,
  // region=undefined,
  setModal,
 }: ScopeActivityProps) {

  function onClick(e: MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    setModal({
      sourceFiles,
      value,
      // region,
      activity
    });
  };

  return (
    <div className="log row" onClick={onClick}>
      <span className="activity">{ activity }</span>
      <span>{ `${unitType === "money" ? "$" : ""}${value.toLocaleString()} ${unit}` }</span>
      <div className="align-end icon-text">
        <span>{formatCO2e(co2e)}</span>
        <span className="material-symbols-rounded">info</span>
      </div>
    </div>
  );

};
