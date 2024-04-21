import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { RestrictedRoute } from "./features/handlers/RestrictedRoute"

import HomePage from "./features/home/HomePage.jsx"
import LoginPage from "./features/users/LoginPage.jsx"
import RegisterPage from "./features/users/RegisterPage.jsx"
import CalendarPage from "./features/classes/CalendarPage.jsx"
import BookingsPage from "./features/bookings/BookingsPage.jsx"
import CreateBookingPage from "./features/bookings/CreateBookingPage"
import BlogPage from "./features/blogs/BlogPage"
import ProfilePage from "./features/users/ProfilePage.jsx"
import UsersListPage from "./features/users/UsersListPage.jsx"
import ErrorPage from "./features/handlers/ErrorPage"
import ImportPage from "./features/import/ImportPage"
import EditUserPage from "./features/users/EditUserPage"

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
        path: "/error",
        element: <ErrorPage />
    },
    
    // ------- Restricted Routes ------- //
    {
        path: "/profile",
        element: <RestrictedRoute allowedRoles={["manager", "trainer", "member"]}>
            <ProfilePage />
        </RestrictedRoute>
    },
    {
        path: "/blog",
        element: <RestrictedRoute allowedRoles={["manager", "trainer", "member"]}>
        <BlogPage />
    </RestrictedRoute>
    },
    {
        path: "/bookings",
        element: <RestrictedRoute allowedRoles={["member"]}>
            <BookingsPage />
        </RestrictedRoute>
    },
    {
        path: "/create-booking",
        element: <RestrictedRoute allowedRoles={["member"]}>
            <CreateBookingPage />
        </RestrictedRoute>
    },
    {
        path: "/users-list",
        element: <RestrictedRoute allowedRoles={["manager"]}>
            <UsersListPage />
        </RestrictedRoute>
    },
    {
        path: "/edit-user",
        element: <RestrictedRoute allowedRoles={["manager"]}>
            <EditUserPage />
        </RestrictedRoute>
    },
    {
        path: "/import",
        element: <RestrictedRoute allowedRoles={["manager"]}>
            <ImportPage />
        </RestrictedRoute>
    }
])

export default router