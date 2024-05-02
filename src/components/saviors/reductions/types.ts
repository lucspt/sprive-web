import { Logs, Scope } from "../../../types";

export interface ScopeReductionChartProps {
  scopeYearlyAverageEmissions: number, 
  defaultReductionPct?: number, 
  scope: Scope | string, 
  minBaseYear: number
}

export interface LoaderResponse {
  scopeOneAndTwo: number, 
  scopeThree?: number, 
  logs: Logs,
  scopeOneAndTwoTitle: string,
  scopeThreeMinBaseYear: number
  scopeOneAndTwoMinBaseYear: number
}

export interface LoaderScopeObject {
  co2e: number | null,
  years: Set<number>
}
export type LoaderEmissionsPerScope = {
  [key in Scope]: LoaderScopeObject
}