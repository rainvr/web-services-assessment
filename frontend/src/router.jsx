import { createBrowserRouter, RouterProvider } from "react-router-dom";
// TODO: import Restricted Routes (wk6 files)
// import { RestrictedRoute } from "./common/RestrictedRoute";  
import HomePage from "./features/HomePage.jsx";
import LoginPage from "./features/LoginPage.jsx";
import RegisterPage from "./features/RegisterPage.jsx";
import CalendarPage from "./features/CalendarPage.jsx";
import BookingsPage from "./features/BookingsPage.jsx";
import BlogPage from "./features/BlogPage.jsx";
import ProfilePage from "./features/ProfilePage.jsx";

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
    }  //,  TODO: Restricted Routes on menu items
    // {
    //     path: "/logout",
    //     element: <RestrictedRoute allowedRoles={["user", "admin", "moderator"]}>
    //         <AnimalListPage />
    //     </RestrictedRoute>
    // }
])

function Router() {
    return (
    <RouterProvider router={router}/>
    )
  }

export default Router