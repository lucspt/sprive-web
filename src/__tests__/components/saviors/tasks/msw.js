import { HttpResponse, http } from "msw";
import { server } from "../../../msw/server"
import { mockTasks } from "../../../msw/mock-data";

const endpoint = `${import.meta.env.VITE_API_URL}/tasks`;

export const setupHandlers = () => {
  server.use(
    http.patch(`${endpoint}/:taskId/assignees`, async ({ request, params }) => {
      const found = mockTasks.findIndex(x => x._id === params.taskId)
      const req = await request.json();
      mockTasks[found].assignee = req.assignee;
      return HttpResponse.json({ content: mockTasks[found] }, {status: 201});
    })
  );
};

export const setupEmptyDataHandlers = () => {
  server.use(
    http.get(endpoint, () => {
      return HttpResponse.json({ content: [] }, { status: 200 });
    }),
  );
};

