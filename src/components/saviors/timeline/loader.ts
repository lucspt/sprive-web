import { DynamicObject, SpriveResponse, Task } from "../../../types";
import { fetchWithAuth } from "../../../utils/utils";
import { TasksGroupedByMonthAndType, TimelineLoaderResponse } from "./types";

export async function timelineLoader(): Promise<TimelineLoaderResponse> {
  // we group by type and whether it's completed or not 
  // and pass the respective sections to a TaskSection component
  const tasks = await fetchWithAuth("tasks") as SpriveResponse<Task[]>;
  const { content } = tasks;
  const groupedByMonth: TasksGroupedByMonthAndType = {};
  const isBehindTracker: DynamicObject<number> = {};
  content?.map(({ created_at, complete, type }) => {
    const dateCreated = new Date(`${created_at}Z`);
    const month = dateCreated.getMonth();
    if (!groupedByMonth[month]) groupedByMonth[month] = {collection: {}, processing: {}, review: {}};
    groupedByMonth[month][type][`${complete}`] = (groupedByMonth[month][type][`${complete}`] || 0) + 1;
    if (!complete) {
      isBehindTracker[month] = (isBehindTracker[month] || 0) + 1;
    };
  });
  const months = Object.keys(groupedByMonth);
  const startMonthNum = Math.min(...months.map(x => Number(x)));
  let isBehind = false;
  if (startMonthNum < new Date().getMonth()) {
    isBehind = Object.values(isBehindTracker).some(x => x > 0)
  }
  
  return { 
    tasks: groupedByMonth,  
    startMonthNum, 
    isBehind
  };

}