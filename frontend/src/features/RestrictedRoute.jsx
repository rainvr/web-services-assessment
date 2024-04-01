import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../features/authentication"
// import { Header } from "./components/Header.jsx"  // TODO: reinstate this, and below <Header /> ?

export function RestrictedRoute({ allowedRoles = [], children }) {
    const [userObject, login, logout] = useAuthentication()
    const navigate = useNavigate()

    const userIsAuthorised = userObject && allowedRoles.includes(userObject.user.role)

    return userIsAuthorised
        ? children
        : <>
            {/* <Header /> */}
            <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="text-4xl">Not Authorised</h2>
                <span className="text-xl">Access role is not permitted to view this page.</span>
                <button className="btn btn-lg" onClick={() => navigate(-1)}>Back</button>
            </div>
        </>
}