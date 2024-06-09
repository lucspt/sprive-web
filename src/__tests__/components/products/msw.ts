import { HttpResponse, http } from "msw"
import { mockProduct } from "../../msw/mock-data"
import { server } from "../../msw/server";

export const setupHandlers = () => {
  server.use(
    http.get(`${import.meta.env.VITE_API_URL}/products/:productId`, () => {
      return HttpResponse.json({content: mockProduct}, { status: 200 });
    })
  );
};