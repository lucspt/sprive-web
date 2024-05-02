import { SpriveResponse, Task } from "../../../types";
import { fetchWithAuth } from "../../../utils/utils";
import { TasksLoaderResponse } from "./types";

export const tasksLoader = async (): Promise<TasksLoaderResponse> => {
  const res = await Promise.all([
    fetchWithAuth("tasks"),
    fetchWithAuth("saviors/company-teams"),
    fetchWithAuth("saviors/company-users")
  ]);
  const [ tasks, assignableTeams, employees ] = res;
  const tasksComplete: Task[] = [];
  const tasksTodo: Task[] = [];
  (tasks as SpriveResponse<Task[]>).content.map(x => {
    const { complete } = x;
    if (complete) {
      tasksComplete.push(x);
    } else tasksTodo.push(x);
  }); 
  return { 
    todo: tasksTodo, 
    complete: tasksComplete,
    assignableTeams: (assignableTeams as SpriveResponse).content,
    employees: (employees as SpriveResponse).content
  };
}