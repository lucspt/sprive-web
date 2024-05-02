import { HttpResponse, http } from "msw";
import { server } from "../../../msw/server";

const api = "http://localhost:8000";
const endpoint = `${api}/saviors/products`;

export const setupEmptyProductsHandler = () => {
  server.use(
    http.get(
      endpoint, () => {
        return HttpResponse.json({ content: [] }, { status: 200 });
      }
    )
  );
};

export const MOCK_PRODUCT = {
    "_id": "65eca7930179199704c58ad0",
    "co2e": 10,
    "category": null,
    "product_id": "65eca7930179199704c58ad0",
    "rating": null,
    "created_at": "2024-03-09 18:18:41.937000",
    "last_update": "2024-03-26 00:05:11.007000",
    "name": "Tester product"
};

export const MOCK_PRODUCTS = [MOCK_PRODUCT];
export const setupHandlers = () => {
  server.use(
    http.get(
      endpoint, () => {
        return HttpResponse.json({ content: MOCK_PRODUCTS }, { status: 200 });
      }
    ),
    http.get(
      `${endpoint}/:id`, () => {
        return HttpResponse.json({ content: MOCK_PRODUCT })
      }
    )
  );
};

export const setupEditProcessHandler = () => {
  server.use(
    http.put(
      `${api}/products/processes/:id`, ({ request }) => {
        return HttpResponse.json({content: true}, { status: 200 });
      }
    )
  )
};