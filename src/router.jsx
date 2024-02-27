import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Calendar from "./pages/Calendar.jsx";
import Bookings from "./pages/Bookings.jsx";
import Blog from "./pages/Blog.jsx";
import Profile from "./pages/Profile.jsx";

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
    },
    {
        path: "/calendar",
        element: <Calendar />
    },
    {
        path: "/bookings",
        element: <Bookings />
    },
    {
        path: "/blog",
        element: <Blog />
    },
    {
        path: "/profile",
        element: <Profile />
    }
])

function Router() {
    return (
    <RouterProvider router={router}/>
    )
  }

export default Router