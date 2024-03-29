import { createBrowserRouter, RouterProvider } from "react-router-dom";
// TODO: import Restricted Routes (wk6 files)
// import { RestrictedRoute } from "./common/RestrictedRoute";  
import HomePage from "./features/HomePage.jsx";
import LoginPage from "./features/users/LoginPage.jsx";
import RegisterPage from "./features/users/RegisterPage.jsx";
import CalendarPage from "./features/CalendarPage.jsx";
import BookingsPage from "./features/BookingsPage.jsx";
import BlogPage from "./features/BlogPage.jsx";
import ProfilePage from "./features/users/ProfilePage.jsx";
import UsersListPage from "./features/users/UsersListPage.jsx";

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
        path: "/users-list",
        element: <UsersListPage />
    }
    
    //,  TODO: Restricted Routes on menu items
    // {
    //     path: "/logout",
    //     element: <RestrictedRoute allowedRoles={["user", "admin", "moderator"]}>
    //         <AnimalListPage />
    //     </RestrictedRoute>
    // }
])


export default router