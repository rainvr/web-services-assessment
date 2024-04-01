// --- The header element for the application --- \\
import { Link } from "react-router-dom"
import { useAuthentication } from "../../features/authentication"

function Header() {
    // import the authenticated user and related functions
    const [authenticatedObject, login, logout, refresh] = useAuthentication()

    // Add a null check to make sure that authenticatedUser is not null
    // if (authenticatedUser === null) {
    //     return <div>Loading...</div>
    // }

    return (
        // <header className="flex flex-col bg-slate-500">This is the Header</header>

        <div className="navbar bg-slate-200">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/calendar">Calendar</Link></li>
                        <li><Link to="/bookings">Bookings</Link></li>
                        <li><Link to="/blog">Blog</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link className="btn btn-ghost text-xl" to="/">High Street Gym</Link>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            {/* <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" /> */}
                            <img alt="Login Icon" src="/src/common/icon/login.png" />  {/* TODO: make this image a bit nicer */}
                        </div>
                    </div>
                    {/* If authenticated user exists show their firstname, if not (i.e. during loading, or if none logged in) return nothing */}
                    { authenticatedObject ? ( <div className="justify-self-center">{authenticatedObject.user.firstname}</div> ) : null }
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><Link to="/">Logout</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header