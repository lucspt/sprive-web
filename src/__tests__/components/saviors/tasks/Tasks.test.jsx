import { renderWithRouter } from "../../../utils";
import { Tasks } from "../../../../components/saviors/tasks/Tasks";
import { tasksLoader } from "../../../../components/saviors/tasks/loader";
import { act, fireEvent, screen, waitFor, getByTestId, getAllByText } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { mockTasks, mockCompanyUsers } from "../../../msw/mock-data";
import { setupEmptyDataHandlers, setupHandlers } from "./msw";
import { assignTask } from "../../../../components/saviors/tasks/AssigneePicker";

function _render(extraRoutes) {
  renderWithRouter(
    <Tasks />,
    "/saviors/tasks",
    { loader: tasksLoader, action: assignTask },
    extraRoutes
  )
}
describe("Tasks", () => {

  it("Renders `To do` & `Complete` tables", async () => {
    setupEmptyDataHandlers();
    _render();
    await waitFor(() => {
      [/To do/, /Completed/].map(txt => {
        expect(screen.getByText(txt)).toBeInTheDocument();
      });
    });
  });

  describe("When there are tasks to do", () => {
    beforeEach(() => {
      setupHandlers();
      _render();
    });
    const numTodo = mockTasks.filter(x => x.complete === false).length;
    const numCompleted = mockTasks.length - numTodo;

    const assertCorrectNumRows = async (testId, numRows) => {
      await waitFor(() => {
        const table = screen.getByTestId(testId);
        expect(table.getElementsByClassName("task row").length).toBe(numRows);
      });
    }

    it("Renders `To do` table with correct number of rows", async () => {
      await assertCorrectNumRows("tasks-todo-table", numTodo);
    });

    it("Renders `Completed` table with correct number of rows", async () => {
      await assertCorrectNumRows("tasks-completed-table", numCompleted);
    });
  });

  describe("A `To do` row can assign a task", () => {
    beforeEach(() => {
      setupHandlers();
    });

    it("Can assign tasks", async () => {
      _render();
      const getAssigneePicker = () => {
        const todoTable = screen.getByTestId("tasks-todo-table");
        return todoTable.getElementsByClassName("dropdown-button")[0];
      }
      const mockAssignee = mockCompanyUsers[0];
      await waitFor(async () => {
        const assigneePicker = getAssigneePicker();
        act(() => {
          fireEvent.focus(assigneePicker)
        });
        const choiceBtn = getByTestId(assigneePicker.nextElementSibling, `dropdown-picker-button-${mockAssignee}`);
        act(() => fireEvent.click(choiceBtn));
      });
      await waitFor(() => {
        expect(getAssigneePicker().firstChild.textContent).toEqual(mockAssignee)
      });
    });
    
    it("An `Upload` button redirects to correct file importer", async function() {
      const fileUploaderText = "FILE UPLOAD";
      _render([
        { path: "/saviors/file-upload", element: <div>{ fileUploaderText }</div>}
      ]);
      
      await waitFor(async () => {
        const todoTable = screen.getByTestId("tasks-todo-table");
        const uploadButton = getAllByText(todoTable, "Upload")[0];
        act(() => fireEvent.click(uploadButton));
        
        await waitFor(() => {
          expect(screen.getByText(fileUploaderText)).toBeInTheDocument();
        })
      });

    });

  });

}); 