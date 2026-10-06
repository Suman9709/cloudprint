import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import { BrowserRouter } from "react-router-dom";

import {RouterProvider} from "react-router-dom";
import { router } from "./router/index.tsx";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
   
  </StrictMode>,
)
