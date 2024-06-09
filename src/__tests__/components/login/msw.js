import { http, HttpResponse } from "msw"
import { server } from "../../msw/server";

const endpoint = `${import.meta.env.VITE_API_URL}/partners/login`;
const email = "lovelife@sprive.com",
password = "123";

const mockLoginResult = {
  "username": "love",
  "password": "life",
  "savior_id": "123",
  "bio": "We are testing Login component!",
  "company_id": "hello there!!!",
  email,
  password
};

export const mockLoginCredentials = { email, password };

export const setupHandlers = () => {
  server.use(
    http.post(endpoint, async ({ request }) => {
      const credentials = await request.json()
      if (Object.keys(mockLoginCredentials).every(cred => {
        return mockLoginCredentials[cred] === credentials[cred]
      })) {
        return HttpResponse.json({ mockLoginResult, }, { status: 200 });
      } else {
        return HttpResponse.json({ content: "Invalid email or password" }, { status: 409 })
      }
    })
  );
};