/**
 * React entrypoint file.
 * 
 * Creates the app `BrowserRouter` and renders it.
*/

/* v8 ignore start */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouteObject, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routes } from './routes.jsx';
import SaviorContextProvider from "./contexts/savior/SaviorContext";

const router = createBrowserRouter(routes as RouteObject[]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
    <SaviorContextProvider>
      <RouterProvider router={router} />
    </SaviorContextProvider>
	</React.StrictMode>
)
/* v8 ignore stop */