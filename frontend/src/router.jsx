import { createBrowserRouter, RouterProvider } from "react-router-dom";
// TODO: import Restricted Routes (wk6 files)
import { RestrictedRoute } from "./features/RestrictedRoute";

import HomePage from "./features/HomePage.jsx";
import LoginPage from "./features/users/LoginPage.jsx";
import RegisterPage from "./features/users/RegisterPage.jsx";
import CalendarPage from "./features/CalendarPage.jsx";
import BookingsPage from "./features/BookingsPage.jsx";
import BlogPage from "./features/BlogPage.jsx";
import ProfilePage from "./features/users/ProfilePage.jsx";
import UsersListPage from "./features/users/UsersListPage.jsx";
import ErrorPage from "./features/ErrorPage";

// Declaring a router to map URL paths to react components
// When a user visits a path a different component will render
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },
    {
        path: "/calendar",
        element: <CalendarPage />
    },
    {
        path: "/bookings",
        element: <BookingsPage />
    },
    {
        path: "/blog",
        element: <BlogPage />
    },
    {
        path: "/profile",
        element: <ProfilePage />
    },
    {
        path: "/error",
        element: <ErrorPage />
    },
    // {
    //     path: "/users-list",
    //     element: <UsersListPage />
    // },
    // ------- Restricted Routes ------- //
    {
        path: "/users-list",
        element: <RestrictedRoute allowedRoles={["manager"]}>
            <UsersListPage />
        </RestrictedRoute>
    }
])

export default router