import { setupServer } from "msw/node";
import { commonHandlers } from "./commonHandlers";

export const server = setupServer(...commonHandlers);
