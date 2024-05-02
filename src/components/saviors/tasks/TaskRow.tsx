import AssigneePicker from "./AssigneePicker";
import { capitalize } from "../../../utils/utils";

import { TaskRowProps } from "./types";
import { GHGCategoryToAbbreviatedName } from "../../../constants";

const TaskRow = ({
  name, 
  category, 
  assignee, 
  action, 
  onClick, 
  employees, 
  // assignableTeams,
  id,
  isCompleted,
  ghgCategory,
  fetcher,
 }: TaskRowProps) => {

  return (
    <div className="task row">
      <span>{ GHGCategoryToAbbreviatedName[ghgCategory] || capitalize(category) }</span>
      <span>{name}</span>
      <AssigneePicker 
        taskIsComplete={isCompleted}
        // teams={assignableTeams} 
        employees={employees} 
        assignee={assignee} 
        fetcher={fetcher}
        taskId={id as string}
      />
      <div className="align-end action">
      <button className="align-end action" onClick={onClick}>
        
        {
          action && 
          <>
          <span className="align-end action">{ action }</span> 
          <span className="material-symbols-rounded">chevron_right</span>
        </>
    }
    </button>
    </div>
    </div>
  )
} 

export default TaskRow