import { HttpResponse, http } from "msw";
import { server } from "../../../msw/server";

const endpoint = "http://localhost:8000/saviors";
export const setupEmptyHadlers = () => {
  server.use(
    http.get(`${endpoint}/pledges`, () => {
      return HttpResponse.json({ content: [] })
    }),
    http.get(`${endpoint}/logs`, () => {
      return HttpResponse.json({ content: [] })
    })
  );
};

export const setupHandlers = () => {
  server.use(
    http.get(`${endpoint}/pledges`, () => {
      return HttpResponse.json({ content: [] })
    })
  );
};