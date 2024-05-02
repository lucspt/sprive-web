import { Logs } from "../types";

export interface OverviewData {
  logs: Logs,
  bottomChartsHeaderCreator: Function,
  mostRelevantYear: number,
}