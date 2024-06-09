import { getCookie } from "../../utils/utils";
import { server } from "../msw/server"
import { http, HttpResponse } from "msw";

const endpoint = import.meta.env.VITE_API_URL;
export const fetchWithAuthEndpoint = "fetchWithAuthTest"
export const fetchWithAuthRes = "RESPONSE";
export const fetchWithAuthSuccessCode = 200;
export const unauthorizedEndpoint = "no-auth";
export const mockTokenValue = "mockToken";
const fetchWithAuthHandler = (token) => {
  if (token) {
    return HttpResponse.json(
      {content: fetchWithAuthRes}, 
      { status: 200 }
    )
  } else {
    throw Error();
  };
};

export const setupHandlers = () => {
  server.use(
    http.get(`${endpoint}/${fetchWithAuthEndpoint}`, ({ request }) => {
      return fetchWithAuthHandler(request.headers.get("X-CSRF-TOKEN"))
    }),
    http.post(`${endpoint}/${fetchWithAuthEndpoint}`, ({ request }) => {
      return fetchWithAuthHandler(request.headers.get("X-CSRF-TOKEN"))
    }),
    http.get(`${endpoint}/${unauthorizedEndpoint}`, () => {
      return HttpResponse.json({content: "UNAUTHORIZED" }, { status: 401 });
    })
  );
};