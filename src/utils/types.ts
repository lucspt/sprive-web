import { Log, RequestMethod, SpriveResponse } from "../types";

export interface FilterLogsForRelevantDateOpts {
  onlyProcessed?: boolean,
  filters?: (log: Log) => boolean
}

export interface FetchWithAuthOptions {
  body?: any,
  headers?: HeadersInit,
  responseMethod?: "json" | "blob" | "formData",
  fetchOptions?: RequestInit,
  isFileUpload?: boolean,
  stringifyBody?: boolean,
  setState?: (res: any) => any,
  onUnauthorized?: Function,
  method?: RequestMethod
};

export type FetchWithAuthResponse<RT extends SpriveResponse | Response | undefined> = RT

export interface FormatCO2eOptions<RT extends boolean = true> {
  maximumFractionDigits?: number,
  stringify?: RT
}

export type FormatCO2eResponse<Stringify extends boolean> = Stringify extends true ? string : string[];

export type MergeObjectsResult<P, K extends string, N> = P & {[X in K]: N};