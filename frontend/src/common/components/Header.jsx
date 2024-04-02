// --- The header element for the application --- \\
import { Link, useNavigate } from "react-router-dom"
import { useAuthentication } from "../../features/authentication"

function Header() {
    // import the authenticated user and related functions
    const [authObject, login, logout, refresh] = useAuthentication()
    const navigate = useNavigate()

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
                        { authObject && authObject.user.role === "member" ? <li><Link to="/bookings">Bookings</Link></li> : null }
                        { authObject && authObject.user.role === "trainer" ? <li><Link to="/classes">Classes</Link></li> : null }
                        { authObject && authObject.user.role === "manager" ? <li><Link to="/users-list">Users</Link></li> : null }
                        { authObject && (authObject.user.role === "trainer" | authObject.user.role === "manager") ? <li><Link to="/import">Import</Link></li> : null }
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
                    { authObject ? ( <div className="justify-self-center">{authObject.user.firstname}</div> ) : null }
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        { !authObject ? <li><Link to="/register">Register</Link></li> : null }
                        { !authObject ? <li><Link to="/login">Login</Link></li> : null }
                        { authObject ? <li><Link to="/profile">Profile</Link></li> : null }
                        { authObject ? <li><button onClick={() => logout().finally(() => navigate("/"))}>Logout</button></li> : null }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header