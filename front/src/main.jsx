import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import routes from './routes.jsx'
import SaviorContextProvider from "./contexts/SaviorContext"

const router = createBrowserRouter(routes)

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
      <SaviorContextProvider>
        <RouterProvider router={router} />
      </SaviorContextProvider>
	</React.StrictMode>
)