import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import router from "./router.jsx"
import { AuthenticationProvider } from './features/authentication.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthenticationProvider router={router}>
      <RouterProvider router={router}/>
    </AuthenticationProvider>
  </React.StrictMode>,
)
