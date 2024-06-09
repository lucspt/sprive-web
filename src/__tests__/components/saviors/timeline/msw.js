import { HttpResponse, http } from "msw";
import { mockServerDateString, setupEmptyDataHandler } from "../../../utils";
import { mockTasks } from "../../../msw/mock-data";
import { server } from "../../../msw/server";

const endpoint = `${import.meta.env.VITE_API_URL}/tasks`;
export const setupEmptyTasks = () => setupEmptyDataHandler("tasks");


const lastMonth = mockServerDateString(
  new Date(new Date().setMonth(new Date().getMonth() - 2))
);
const mockBehindDatasetsTasks = mockTasks.map(task => {
  return {
    ...task,
    complete: false,
  };
});

export const setupBehindTasks = () => {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.json( { content: mockTasks }, { status: 200} );
    })
  );
}; 

const now = mockServerDateString(new Date());

const mockTasksDue = mockTasks.map(task => {
  return {
    ...task,
    complete: false,
    created_at: now
  };
})

export const setupTasksDue = () => {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.json({ content: mockTasksDue }, {status: 200})
    })
  );
};

const mockTasksCompleted = mockTasks.map(task => {
  return {
    ...task,
    complete: true,
    created_at: now
  };
})
export const setupAllTasksComplete = () => {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.json({ content: mockTasksCompleted }, { status: 200 } );
    })
  )
}