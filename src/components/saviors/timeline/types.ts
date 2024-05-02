import { GroupedObject, TaskType } from "../../../types"

export interface TaskSectionProps {
  section: TaskType,
  numCompleted?: number, 
  numIncomplete?: number, 
  warningMessage?: string
}

export type TasksGroupedByType = GroupedObject<GroupedObject<number>>;
export type TasksGroupedByMonthAndType = GroupedObject<TasksGroupedByType>;

export interface TimelineLoaderResponse {
  tasks: TasksGroupedByMonthAndType,
  isBehind: boolean,
  startMonthNum: number,
};

export interface TimelineDaysProps {
  monthName: string, 
  days: number[], 
  tasks: TasksGroupedByType | undefined, 
  currentMonthEnd: number, 
  currentMonth: Date,
  isCurrentMonth: boolean,
  showDueDate: boolean
}

export interface TimelineRulerProps {
  startMonthEnd: Date,
  nextMonthEnd: Date,
  twoMonthsEnd: Date,
};