import { useCallback, useState } from "react";
import { formatCO2e, isObjectEmpty } from "../../../utils/utils";
import { DataTable } from "../../table/DataTable";;
import { ActivityModal } from "./ActivityModal";
import { EmissionsScope } from "./EmissionsScope";
import { ScopeActivity } from "./ScopeActivity";
import { ScopesTableHeader } from "./ScopesTableHeader";
import { ActivityModalProps, EmissionsByScopeTableProps, EmissionsPageLog } from "./types";
import { Scope } from "../../../types";
import { __TableLastLevel, __TableScopeThree } from "../../../hooks/emissions/types";

/**
 * Renders a table that breaks down a savior's emissions by 
 * scope, GHG category if scope is 3, and activity.
 * 
 * @param props
 * @param props.emissionsByScope - The emissions per scope.
 * @param logs - Logs to create a csv file from.
 * @returns The table component.
 */
export function EmissionsByScopeTable({ emissionsByScope, logs }: EmissionsByScopeTableProps) {
  const [ activityModal, setActivityModal ] = useState<ActivityModalProps|{}>({});
  
  /**
    creates an activity that renders a modal pop with it's info on click.
    We put this in a function so we dont have to prop drill `setActivityModal`
    and repeat writing all of these props along with it, 
    yet we write an essay explaining why, lol. 
    We pass as a prop, so `useCallback`.
   */
  const renderScopeActivity = useCallback((log: EmissionsPageLog) => {
    const { activity } = log
    return (
      <ScopeActivity 
        activity={activity} 
        key={activity}
        // unitType={log.unit_type}
        co2e={log.co2e} 
        value={log.value} 
        unit={log.unit}
        setModal={setActivityModal}
        sourceFiles={log.sourceFiles}
        // region={log.region}
      />
    );
  }, []);


  /**
   * Creates an accordion component that breaksdown the scope's 
   * activities logged by the savior.
   * 
   * We put this in a function to not repeat so many props when rendering 3 of them.
   */
  const renderScope = (scope: Scope, isScopeThree=false) => {
    const { totalCO2e, logs } = (emissionsByScope[scope] || {});
    return logs && totalCO2e && (
      <EmissionsScope 
        scope={scope}
        logs={logs as __TableScopeThree | __TableLastLevel}
        co2e={totalCO2e}
        setActivityModal={setActivityModal}
        renderActivity={renderScopeActivity}
        key={`scope-${scope}`}
        isScopeThree={isScopeThree}
      />
    );
  };

  return (
    <div className="table">
      <DataTable
        className="emissions"
        columns={["Activity", "Value", "CO₂e"]}
        TitleComponent={<ScopesTableHeader logs={logs}/>}
      >
        <div className="total-emissions row">
          <span>Total Emissions</span>
          <span className="digit">{ formatCO2e(emissionsByScope.totalEmissions || 0, {maximumFractionDigits: 3}) }</span>
        </div>
        {renderScope("3", true)}
        {renderScope("2")}
        {renderScope("1")}
        <ActivityModal
        {...(activityModal as ActivityModalProps)}
          visible={!isObjectEmpty(activityModal)} 
          close={() => setActivityModal({})}
        />
      </DataTable>
    </div>
  )
}