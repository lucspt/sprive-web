import { ReactNode } from "react";
import { fetchWithAuth } from "../../../utils/utils";
import DropdownPicker from "../../inputs/picker/DropdownPicker";
import { AssigneePickerProps } from "./types";

export async function assignTask({ request }: { request: Request }) {
  const formData = await request.formData();
  await fetchWithAuth(
      `tasks/${formData.get("task")}/assignees`, 
      { 
        body: { assignee: formData.get("assignee") || null }, 
        method: "PATCH", 
      }
    );
  return null;
}


export default function AssigneePicker({ 
  assignee, 
  employees, 
  taskId, 
  fetcher,
  taskIsComplete
 }: AssigneePickerProps) {
  const MaybeForm = ({ children }: { children: ReactNode }) => (
    fetcher && !taskIsComplete
      ? <fetcher.Form method="PUT" action="." className="assignees">{ children }</fetcher.Form>
      : <div className="assignees">{ children }</div>
  );

  return (
    <MaybeForm>
      <input name="task" value={taskId} type="hidden" />
      <DropdownPicker 
        name="assignee"
        values={employees?.map(x => ({label: x, value: x}))} 
        noneOption 
        defaultValue={assignee || "No Assignee"}
        noneOptionLabel="No Assignee" 
        readOnly={taskIsComplete}
        noneOptionValue={null}
        buttonType="submit"
      />
    </MaybeForm>
  )
}
