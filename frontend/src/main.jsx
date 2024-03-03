import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Router from "./router.jsx"
// import { AuthenticationProvider } from './features/authentication.jsx'

// TODO: enable the AuthenticationProvider below
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <AuthenticationProvider router={router}> */}
      <Router />
    {/* </AuthenticationProvider> */}
  </React.StrictMode>,
)
