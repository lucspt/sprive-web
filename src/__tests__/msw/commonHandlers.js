import { HttpResponse, http } from "msw";
import { 
  defaultMockLogs, 
  mockTasks, 
  mockCompanyTeams, 
  mockCompanyTree, 
  mockCompanyUsers, 
  mockLoginResult,
  mockProduct
 } from "./mock-data";

const apiEndpoint = "http://localhost:8000"
const logsEndpoint = `${apiEndpoint}/saviors/logs`;

const mockGetAndPost = (endpoint, content, onPost) => {
  const _endpoint = `${apiEndpoint}/saviors/${endpoint}`
  return [
    http.get(_endpoint, () => {
      return HttpResponse.json({ content }, { status: 200 })
    }),
    http.post(_endpoint, async ({ request }) => {
      const payload = await request.json();
      onPost(payload || content.push(payload));
      return HttpResponse.json({ content: payload }, { status: 201 });
    }),
  ];
};

export const commonHandlers = [
  ...mockGetAndPost(
    "company-teams",
     mockCompanyTeams, 
     ({ username }) => mockCompanyTeams.push({ username })
    ),
  ...mockGetAndPost(
    "company-tree", 
    mockCompanyTree,
    ({ username }) => mockCompanyTree.push({username})
  ),
  http.get(`${apiEndpoint}/tasks`, () => {
    return HttpResponse.json({ content: mockTasks });
  }),
  http.get(
    `${apiEndpoint}/saviors/company-users`, () => {
      return HttpResponse.json({ content: mockCompanyUsers }, { status: 200 });
    }
  ),
  http.get(logsEndpoint, () => {
    return HttpResponse.json({ content: defaultMockLogs }, { status: 200 });
  }),
  http.get(`${apiEndpoint}/products/:productId`, () => {
    return HttpResponse.json({content: mockProduct}, { status: 200 });
  }),
  http.get(`${apiEndpoint}/saviors/products/:productId`, () => {
    return HttpResponse.json({content: mockProduct}, { status: 200 });
  })
];
