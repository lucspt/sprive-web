import TaskSection from "./TaskSection";
import "./TimelineTasks.css"
import { useLoaderData } from "react-router-dom";
import { TasksGroupedByType, TimelineLoaderResponse } from "./types";

export default function TimelineTasks({ tasks }: { tasks: TasksGroupedByType }) {
  const { isBehind } = useLoaderData() as TimelineLoaderResponse;

  const numIncomplete = tasks.collection.false || 0;
  return (
    <div className="tasks full-space">
      <TaskSection 
        section="Data collection" 
        numCompleted={(tasks?.collection?.true || 0)}
        numIncomplete={numIncomplete}
        warningMessage={
          isBehind 
            ? `You are behind ${numIncomplete} dataset${numIncomplete > 1 ? "s" : ""} this month`
            : numIncomplete 
              ? `You have ${numIncomplete} dataset${numIncomplete > 1 ? "s" : ""} left` 
            : ""
        }
      />
      <TaskSection section="Data processing" />
      <TaskSection section="Review" />
    </div>
  )
}