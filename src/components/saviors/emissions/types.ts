import { ReactNode } from "react";
import { GHGCategory, Logs, MaybeGHGCategory, OnClickFn, Scope, SourceFile } from "../../../types";
import { EmissionsByScopeTable, __TableLastLevel, __TableScopeThree } from "../../../hooks/emissions/types";

type SetModalFn = (modalInfo: {[key: string]: string|number|SourceFile[]|GHGCategory}) => void;
type RenderActivityFn = (log: EmissionsPageLog) => ReactNode;


export interface EmissionsPageLog {
  sourceFiles: [] | SourceFile[], 
  value: number, 
  co2e: number, 
  activity: string, 
  unit: string, 
  scope: Scope,
  ghgCategory: MaybeGHGCategory
}

export interface ActivityModalProps {
  visible: boolean,
  activity: string,
  sourceFiles: SourceFile[],
  value: number,
  region?: string,
  close: Function,
};

export interface ScopeThreeCategoryProps {
  ghgCategory: GHGCategory, 
  logs: EmissionsPageLog[], 
  // onExpand: Function, 
  // onCollapse: Function, 
  renderActivity: RenderActivityFn,
  co2e: number
};

export interface EmissionsTableAccordionProps {
  children: ReactNode, 
  title: string, 
  className?: string, 
  co2e: number,
  onClick?: OnClickFn<HTMLDivElement>,
};

export interface ScopeActivityProps {
  activity: string, 
  value: number, 
  unit: string, 
  co2e: number, 
  unitType?: string,
  sourceFiles: SourceFile[],
  region?: string,
  setModal: SetModalFn
};

export interface EmissionsScopeProps {
  scope: Scope, 
  logs: __TableLastLevel | __TableScopeThree,
  isScopeThree: boolean, 
  setActivityModal: SetModalFn,
  renderActivity: RenderActivityFn,
  co2e: number,
}

export interface EmissionsByScopeTableProps {
  emissionsByScope: EmissionsByScopeTable,
  logs: Logs
}