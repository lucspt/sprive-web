import { server } from "../../msw/server";
import { http, HttpResponse } from "msw";

export const mockTakenEmail = "emailtaken@taken.com"
export const mockSuccessEmail = "emailsuccess@emailsuccess.com";
export const setupHandlers = () => {
  server.use(
    http.get(
      "http://localhost:8000/partners/emails/:email",  ({ params }) => {
        const { email } = params;
        if (email === mockTakenEmail) {
          return HttpResponse.json(
            { content: { is_available: false } }, 
            {status: 409}
          );
        } else if (email === mockSuccessEmail) {
          return HttpResponse.json(
            { content: { is_available: true }},
            { status: 201 }
          );
        };
      }
    )
  )
}