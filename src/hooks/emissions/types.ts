import { EmissionsPageLog } from "../../components/saviors/emissions/types";
import { GHGCategory, GroupedEmissions, Logs } from "../../types";



export interface LogsAndTotalCO2e {
totalCO2e?: number,
logs?: EmissionsPageLog
}


// export interface GHGCategoryLogs {
//   [key: string]: EmissionsPageLog
// };

export interface GHGCategoryActivities {
  [key: string]: EmissionsPageLog
};

export type ScopeLogsScopeThree = {
  [key in GHGCategory]?: GHGCategoryActivities | {totalCO2e: number}
}

export type ScopeLogsOneAndTwo = {
[key: string]: EmissionsPageLog
};

export interface ScopeLogs {
"1"?: ScopeLogsOneAndTwo,
"2"?: ScopeLogsOneAndTwo,
"3"?: ScopeLogsScopeThree & { totalCO2e: number }
};

export interface __TableLastLevel {
logs?: EmissionsPageLog[],
totalCO2e?: number,
}

export interface __TableScopeThree {
  logs?: TableScopeThreeCategories,
  totalCO2e?: number,
}

export type TableScopeThreeCategories = {
[key in GHGCategory]?: __TableLastLevel
} & { totalCO2e?: number }

export interface EmissionsByScopeTable {
"1"?: __TableLastLevel,
"2"?: __TableLastLevel,
"3"?: __TableScopeThree
totalEmissions?: number
};

export interface EmissionsPageData {
  logsToDownload: Logs,
  barChart: GroupedEmissions,
  doughnut: GroupedEmissions,
  table: EmissionsByScopeTable
};