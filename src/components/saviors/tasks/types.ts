import { FetcherWithComponents } from "react-router-dom";
import { GHGCategory, OnClickFn, Task } from "../../../types";

export interface AssigneePickerProps {
  assignee: string, 
  employees: string[], 
  taskId: string, 
  fetcher?: FetcherWithComponents<Task>,
  taskIsComplete: boolean
}

export interface SeeMoreProps {
  isExpanded: boolean, 
  expand: OnClickFn,
  collapse: OnClickFn 
}

export interface TableHeaderProps {
  text: string,
  expand: Function,
  collapse: Function,
  isExpanded: boolean,
  bg: string
};

export interface TaskRowProps {
  name: string, 
  category: string, 
  assignee: string, 
  action: string, 
  onClick?: OnClickFn, 
  employees: string[], 
  // assignableTeams: string[],
  id?: string,
  isCompleted: boolean,
  ghgCategory: GHGCategory,
  fetcher?: FetcherWithComponents<Task>,
}

export interface TasksLoaderResponse {
  todo: Task[], 
  complete: Task[],
  assignableTeams: string[]
  employees: string[]
}

export type TaskTableType = "todo" | "complete";
