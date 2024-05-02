import { DataTable } from "../../table/DataTable";
import { memo } from "react"
import { useFetcher, useLoaderData, useNavigate } from "react-router-dom"
import TaskRow from "./TaskRow"
import "./Tasks.css"
import { useState } from "react"
import TableHeader from "./TableHeader"
import { Header } from "../../header/Header";
import { GHGCategory, Scope } from "../../../types";
import { TaskTableType, TasksLoaderResponse } from "./types";

export const Tasks = memo(() => {
  const nav = useNavigate();
  const tasksData  = useLoaderData();
  const [ isExpanded, setIsExpanded ] = useState({ todo: true, complete: true })
  function onClickAction(
    scope: Scope, 
    category: string,
    unitType: string,
    ghgCategory: GHGCategory,
    taskId: string
  ) {
    nav("/saviors/file-upload", { 
      state: { emissionsScope: scope, category, unitType, ghgCategory, taskId }
    });
  }

  function collapseTable(table: TaskTableType) {
    setIsExpanded(prev => ({...prev, [table]: false}));
  };

  function expandTable(table: TaskTableType) {
    setIsExpanded(prev => ({...prev, [table]: true}));
  };

  const fetcher = useFetcher();
  const { todo, complete, employees } = tasksData as TasksLoaderResponse;
  return (
    <div className="tasks page">
      <Header text="Tasks" />
      <div className="tasks spacing">
        <div className="tasks-table todo">
            <DataTable 
              dataTestId="tasks-todo-table"
              columns={[]}
              className="tasks"
              HeaderComponent={
                <TableHeader
                  text={`To do (${todo.length})`} 
                  isExpanded={isExpanded.todo}
                  collapse={() =>  collapseTable("todo")} 
                  expand={() => expandTable("todo")}
                  bg="var(--lightest-orange)"
                />

              }
            >
              {isExpanded.todo && todo.map(({ 
                category, _id, task, assignee, scope, action, unit_type, ghg_category 
              }) => (
                <TaskRow 
                  key={_id}
                  fetcher={fetcher}
                  name={task} 
                  category={category}
                  action={action}
                  assignee={assignee}
                  id={_id}
                  ghgCategory={ghg_category}
                  // assignableTeams={assignableTeams}
                  isCompleted={false}
                  employees={employees}
                  onClick={() => onClickAction(scope, category, unit_type, ghg_category, _id)}
                />
              ))}
            </DataTable>
            </div>
        <div className="tasks-table complete">
          <DataTable
            className="tasks"
            columns={[]}
            dataTestId="tasks-completed-table"
            HeaderComponent={
              <TableHeader
              text={`Completed (${complete.length})`} 
              isExpanded={isExpanded.complete}
              collapse={() =>  collapseTable("complete")} 
              expand={() => expandTable("complete")}
              bg="var(--lightest-green)"
            />
            }
          >
            {isExpanded.complete && complete.map(({ 
              category, _id, task, assignee, action, scope, unit_type, ghg_category
            }) => (
              <TaskRow 
                key={_id}
                isCompleted={true}
                employees={employees}
                action={`${action} more`}
                name={task} 
                category={category}
                ghgCategory={ghg_category}
                assignee={assignee}
                onClick={() => onClickAction(scope, category, unit_type, ghg_category, _id)}
              />
            ))
            }
          </DataTable>
        </div>
      </div>
    </div>
  )
});