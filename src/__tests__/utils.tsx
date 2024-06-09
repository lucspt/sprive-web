import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { render } from "@testing-library/react";
import SaviorContextProvider from "../contexts/savior/SaviorContext";
import { Fragment, ReactNode } from "react";
import { http, HttpResponse } from "msw";
import { server } from "./msw/server";

export const renderWithRouter = (
  element: ReactNode =<Fragment />,
  path: string ="/", 
  loaderAndOrAction: {
    loader?: Function,
    action?: Function
  }={},
  extraRoutes: Array<any> | [] = [], 
  initialEntries?: string[] | string,
  options={}
) => {
    
  const router = createMemoryRouter(
    [{ path, element, ...loaderAndOrAction }, ...extraRoutes],
    { initialEntries: Array.isArray(initialEntries) ? initialEntries : [initialEntries || path] }
  );
      
  return render(
    <SaviorContextProvider>
      <RouterProvider router={router} />
    </SaviorContextProvider>,
    {...options}
  );
};

export const canvasTestingBeforeEach = (global: any) => {
  global.ResizeObserver = class ResizeObserver {
    observe() {
    }
    unobserve() {
    }
    disconnect() {
    }
  };
};

export const setupEmptyDataHandler = (endpoint: string, emptyObject=[]) => {
  server.use(
    http.get(`${import.meta.env.VITE_API_URL}/${endpoint}`, () => {
      return HttpResponse.json({ content: emptyObject }, { status: 200 } );
    })
  );
};

export const mockServerDateString = (date: Date) => {
  return date.toJSON().split("T").join(" ").split("Z").join(""); 
};