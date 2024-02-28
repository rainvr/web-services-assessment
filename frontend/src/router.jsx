import { createBrowserRouter, RouterProvider } from "react-router-dom";
// TODO: import Restricted Routes (wk6 files)
// import { RestrictedRoute } from "./common/RestrictedRoute";  
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import BookingsPage from "./pages/BookingsPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

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