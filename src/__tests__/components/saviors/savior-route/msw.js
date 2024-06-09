import { mockEmail, mockLoginResult, mockPassword, mockUserAccount } from "../../../msw/mock-data";
import { server } from "../../../msw/server";
import { http, HttpResponse } from "msw";

export const mockLoginCredentials = {
  email: mockEmail,
  password: mockPassword
}
export const setupHandlers = () => {
  server.use(
    http.get(`${import.meta.env.VITE_API_URL}/saviors`, () => {
      return HttpResponse.json({ content : mockUserAccount }, {status: 200});
    })
  );
};