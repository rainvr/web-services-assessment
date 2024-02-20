import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Declaring a router to map URL paths to react components
// When a user visits a path a different component will render
export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />
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