import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../features/authentication"
import Header from "../common/components/Header"
import Footer from "../common/components/Footer"
import ErrorPage from "./ErrorPage" // TODO: remove this?

export function RestrictedRoute({ allowedRoles = [], children }) {
    const [userObject, login, logout] = useAuthentication()
    const navigate = useNavigate()

    const userIsAuthorised = userObject && allowedRoles.includes(userObject.user.role)
    // console.log(userIsAuthorised)  // TODO: remove console test
    return userIsAuthorised
        ? children
        : <>
            <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
                <Header />
                <div className="flex flex-col justify-center items-center gap-4">
                    <h2 className="text-4xl">Not Authorised</h2>
                    <span className="text-xl">Access role is not permitted to view this page.</span>
                    <button className="btn btn-lg" onClick={() => navigate(-1)}>Back</button>
                </div>
                <Footer />
            </main>

            {/* TODO: remove ErrorPage component? */}
            {/* <ErrorPage 
                heading={"Not Authorised"}
                message={"Access role is not permitted to view this page."}
            /> */}
        </>
}