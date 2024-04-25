// --- The header element for the application --- \\
import { Link, useNavigate } from "react-router-dom"
import { useAuthentication } from "../../features/authentication"

function Header() {
    // import the authenticated user and related functions
    const [user, login, logout, refresh] = useAuthentication()
    const navigate = useNavigate()

    return (
        <div className="navbar bg-slate-200">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link to="/calendar">Calendar</Link></li>
                        { user && user.role === "member" ? <li><Link to="/bookings">Bookings</Link></li> : null }
                        { user && user.role === "trainer" ? <li><Link to="/classes">Classes</Link></li> : null }
                        { user && user.role === "manager" ? <li><Link to="/users-list">Users</Link></li> : null }
                        { user && user.role === "manager" ? <li><Link to="/import">Import</Link></li> : null }
                        { user && <li><Link to="/blog">Blog</Link></li> }
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link className="btn btn-ghost text-xl" to="/">High Street Gym</Link>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                            { user ? <span className="text-xs">{user.firstname.charAt(0)} {user.lastname.charAt(0)}</span>
                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg> }
                        </div>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        { !user ? <li><Link to="/register">Register</Link></li> : null }
                        { !user ? <li><Link to="/login">Login</Link></li> : null }
                        { user ? <li><Link to="/profile">Profile</Link></li> : null }
                        { user ? <li><button onClick={() => logout().finally(() => navigate("/"))}>Logout</button></li> : null }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header