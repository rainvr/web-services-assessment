import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx"
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Declaring a router to map URL paths to react components
// When a user visits a path a different component will render
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    }
])

function Router() {
    return (
    <RouterProvider router={router}/>
    )
  }

export default Router