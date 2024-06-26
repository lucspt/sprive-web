import { useContext } from "react"
import { SaviorContext } from "../../contexts/savior/SaviorContext"
import { useLoaderData } from "react-router-dom";
import { filterLogsForRelevantDate } from "../../utils/utils";
import { SaviorContextValuesWithSavior } from "../../contexts/savior/types";
import { GHGCategory, GroupedEmissions, Logs, Scope } from "../../types";
import { SourceFile } from "../../types";
import { 
  EmissionsByScopeTable,
  ScopeLogs,
  ScopeLogsOneAndTwo,
  ScopeLogsScopeThree,
  LogsAndTotalCO2e,
  TableScopeThreeCategories,
  EmissionsPageData,
  GHGCategoryActivities
 } from "./types";
 
import { EmissionsPageLog } from "../../components/saviors/emissions/types";
/**
 * A hook which prepares all the data needed for the `<Emissions />` component.
 * 
 * Given the savior's logs, it will filter them for the most relevant ones, using
 * `utils.filterLogsForRelevantDate()` and from there create the data used for
 * `<MonthlyEmissionsBar />`, `<EmissionsByScopeDoughnut />` and `<EmissionsByScopeTable />`.
 * 
 * @returns An object containing the keys:
 * - `barChart`: The savior's emissions per month, w.r.t to the result of the filtering performed on them.
 * - `doughnut`: The savior's emissions per scope, used to render the doughnut beside the bar chart.
 * - `table`: The table that populates the 'breakdown' section, rendered under the doughnut and bar chart.
 * These are summed emissions grouped by scope, possibly GHG category if scope is 3, and activity. 
 * Note that this hook takes care of activites logged with different unit types,
 *  by separating them before summing emissions.
 * - `logsToDownload` - The logs formatted so that they can be used create a button which will download
 * a .csv file.
 */
export const useEmissions = (): EmissionsPageData => {
  /**
   * There is much to improve with the static typing in this hook. TODO: come back to.
   */
  const joined = (
    useContext(SaviorContext) as SaviorContextValuesWithSavior
  ).savior.joined;

  const logs = filterLogsForRelevantDate(
    useLoaderData() as Logs, joined, { onlyProcessed: true }
  );
  let barChart: GroupedEmissions<{sortBy: Date, co2e: number}> = {},
  doughnut: GroupedEmissions = {},
  table: EmissionsByScopeTable = {},
  scopeLogs: ScopeLogs = {};
  let totalEmissions = 0;
  logs.map(({ source_file, co2e, scope, activity, unit, value, ghg_category }) => {
    totalEmissions += co2e;
    const date = new Date(`${source_file.upload_date}Z`);
    const barChartLabel = date.toLocaleString("default", { month: "numeric", year: "numeric" });
    if (barChart[barChartLabel]) {
      barChart[barChartLabel].co2e += co2e;
    } else {
      barChart[barChartLabel] = { sortBy: date, co2e }
    };

    const doughnutLabel = `Scope ${scope}`
    doughnut[doughnutLabel] = (doughnut[doughnutLabel] || 0) + co2e;

    const initEmissionsPageLog: EmissionsPageLog = { 
      sourceFiles: [], 
      value: 0, 
      co2e: 0, 
      activity, 
      unit, 
      scope,
      ghgCategory: ghg_category
    };
    const label = `${activity} ${unit}`;
    if (!scopeLogs[scope]) {
      (scopeLogs[scope] as LogsAndTotalCO2e) = {totalCO2e: 0};
    };
    ((scopeLogs[scope] as LogsAndTotalCO2e).totalCO2e as number) += co2e;
    if (scope === "3") {
      let currentCategoryLogs: GHGCategoryActivities | EmissionsPageLog = (
        (scopeLogs[scope] as ScopeLogsScopeThree)[(ghg_category as GHGCategory)] as GHGCategoryActivities
      );
      if (!currentCategoryLogs) {
        (scopeLogs[scope] as ScopeLogsScopeThree)[ghg_category as GHGCategory] = {totalCO2e: 0};
      }
      let currentActivityLogs = (
        (scopeLogs[scope] as ScopeLogsScopeThree)[ghg_category as GHGCategory] as {[key: string]: EmissionsPageLog}
      )[label];
      if (!currentActivityLogs) {
        currentActivityLogs = initEmissionsPageLog;
        ((scopeLogs[scope] as ScopeLogsScopeThree)[(ghg_category as GHGCategory)] as GHGCategoryActivities)[label] = currentActivityLogs;
      };
      (((scopeLogs[scope] as ScopeLogsScopeThree)[ghg_category as GHGCategory] as {totalCO2e: number}).totalCO2e) += co2e;
      ((scopeLogs[scope] as ScopeLogsScopeThree)[(ghg_category as GHGCategory)] as {[key: string]: Partial<EmissionsPageLog>})[label] = {
        ...currentActivityLogs,
        sourceFiles: ((currentActivityLogs as EmissionsPageLog).sourceFiles as SourceFile[]).concat(source_file),
        value: (currentActivityLogs as EmissionsPageLog).value + value,
        co2e: (currentActivityLogs as EmissionsPageLog).co2e + co2e,
      };
    } else {
      const currentActivityLogs = ((scopeLogs[scope] as ScopeLogsOneAndTwo)[label] || initEmissionsPageLog);
      (scopeLogs[scope] as ScopeLogsOneAndTwo)[label] = {
        ...currentActivityLogs,
        sourceFiles: (currentActivityLogs.sourceFiles as SourceFile[]).concat(source_file),
        value: currentActivityLogs.value + value,
        co2e: currentActivityLogs.co2e + co2e
      };
    };
  });
  table.totalEmissions = totalEmissions;
  Object.keys(scopeLogs).map(scope => {
    const { totalCO2e, ...logs } = (scopeLogs[scope as Scope] as LogsAndTotalCO2e);
    if (scope === "3") {
      table["3"] = {logs: {}, totalCO2e };
      Object.entries(logs).map(([ ghg_category, categoryLogs ]) => {
        const { totalCO2e, ..._logs } = (categoryLogs as LogsAndTotalCO2e);
        (table["3"]?.logs as TableScopeThreeCategories)[ghg_category as GHGCategory] = { logs: Object.values(_logs), totalCO2e };
      })
    } else {
      table[scope as Scope] = {totalCO2e, logs: Object.values(logs)};
    };
  });

  const _barChart = Object.fromEntries(
    Object.entries(barChart).sort(([, a], [, b]) => {
      return a.sortBy.getTime() - b.sortBy.getTime();
    }).map(([k, v]) => [k, v.co2e])
  );

  return { 
    table,  
    barChart: _barChart,
    doughnut, 
    logsToDownload: logs
  };
}