/**
 * Global types commonly used throughout /src. 
 */

import { ChangeEvent, ComponentType, FormEvent, MouseEvent, ReactNode } from "react";

/** A react component */
export type ReactComponent = ComponentType | JSX.Element | ReactNode;

export type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

/** GHG protocol categories */
export type GHGCategory = 
    "3.1"
  | "3.2"
  | "3.3"
  | "3.4"
  | "3.5"
  | "3.6"
  | "3.7"
  | "3.8"
  | "3.9"
  | "3.10"
  | "3.11"
  | "3.12"
  | "3.13"
  | "3.14";

/** Emissions scopes */
export type Scope = "1" | "2" | "3";

/** The valid roles a savior's account can have */
export type SaviorAccountRole = "user" | "company";

/** As some logs don't have a GHG category, i.e. their scope isn't 3, then this field can be null or undefined.
 * This type covers those scenarios.
 */
export type MaybeGHGCategory = GHGCategory | null | undefined;

/** Css font variables, must be used as a string like so:
 * 
 * @example:
 * const size = "sm" as CSSFontVar
 * <div style={{ fontSize: `var(--fontsize-${size}`}}}}>...</div>
 */
export type CSSFontVar = "sm" | "med" | "lg" | "xl" | "default";

/** A function that receives a button onClick event */
export type OnClickFn<ElType=HTMLButtonElement, Type=void> = (event: MouseEvent<ElType>) => Type

/** A function that receives an input onChange event */
export type OnChangeFn<Type=void> = (event: ChangeEvent<HTMLInputElement>) => Type;

export type FormSubmitFn<Type=void> = (event: FormEvent<HTMLFormElement>) => Type;

export interface SpriveResponse<Type=any> {
  content: Type
};


export interface DynamicObject<Type> {
  [key: string]: Type
}

export interface GroupedObject<Type> {
  [key: string]: Type
}

/**
 * for an object grouping emissions by a dynamic string value.
 * @example const EmissionsGroupedByScope: GroupedEmissions = {"1": 20, "2": 30, "3": 100}
 * 
 * // Nest n levels deep
 * @example const EmissionsGroupedByTwoLevels: GroupedEmissions<GroupedEmissions> = {"1": {"2": 20}}
 */
export interface GroupedEmissions<Type=number> {
  [key: string]: Type
};

export interface ChartJsDataset<DType=number[]> {
  label: string,
  data: DType,
  backgroundColor?: string[] | string,
  [key: string]: any,
}

/** A log's source file object */
export interface SourceFile {
  id: string,
  upload_date: string,
  name: string,
}

/** A savior's account object */
export interface Savior {
  savior_id: string,
  joined: string,
  company_id: string,
  username: string,
  website: string,
  role: SaviorAccountRole
  picture: string,
  email: string,
  bio: string,
  measurement_categories: string[]
  region: string,
  company: string,
  company_email: string
};

/** Usually all activities coming from the server will have these fields.  */
export interface ActivityInfo {
  activity: string,
  value: number,
  unit: string,
  unit_type: string,
}

/** An activity's info, whose emissions have been calculated and stored as the field `co2e`   */
export interface ActivityInfoWithCO2e extends ActivityInfo {
  co2e: number,
}

/** An emissions log, snake case, since it comes from python server. */
export interface Log extends ActivityInfoWithCO2e {
  _id: string,
  scope: Scope,
  category: string,
  ghg_category: MaybeGHGCategory,
  source_file: SourceFile,
  co2e: number,
  savior_id: string,
};


/** An array of logs */
export type Logs = Log[];

/** An array either empty or filled with logs. */
export type PossiblyEmptyLogs = Logs | [];

export type TaskType = "Data collection" | "Data processing" | "Review";

export interface Task {
  created_at: string,
  task: string,
  complete: boolean,
  _id: string,
  category: string,
  assignee: string,
  unit_type: string,
  action: "upload" | "review" | "process",
  type: TaskType,
  ghg_category: GHGCategory,
  scope: Scope,
}