// --- The Login Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthentication } from "../authentication";

export default function LoginPage() {
    const navigate = useNavigate()

    const [user, login, logout, refresh] = useAuthentication() // import the authentication functions and auth user object

    const [statusMessage, setStatusMessage] = useState("")

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    async function handleSubmit(event) {
        event.preventDefault()  // prevents the browser from refreshing/reloading

        //alert(`The form has been submitted with email: ${emailInput} and password: ${passwordInput}`)

        setStatusMessage("Logging in...")

        // TODO: Client side validation (maybe just backend?)

        try {
        // Call the login function from the useAuthentication module
        const loginResult = await login(formData.email, formData.password)
            setStatusMessage("Login Successful!")
            navigate("/")  // Navigate to home
        } catch (error) {
            setStatusMessage("Login failed: " + error)
        }
    }

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <form onSubmit={handleSubmit} className="card-body card mx-auto w-96 bg-base-100 shadow-xl">
                    <h2 className="card-title justify-center mb-4">Login</h2>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                            placeholder="Email"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            pattern="^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$"  // Checks the email pattern
                            required />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid email</span>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                            placeholder="Password"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            // pattern="^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$"  // TODO: Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.
                            required />
                        <span className="invisible ml-1 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid password</span>
                    </label>
                    <button className="btn btn-primary">Login</button>
                    <p className="mx-auto">Not a member yet? <Link to="/register" className="link link-hover">Sign Up</Link></p>  {/* TODO: get link underline on hover */}
                    <label className="label">
                        <span className="label-text-alt">{statusMessage}</span>  {/* TODO: make this nicer */}
                    </label>
                </form>
            </section>
            <Footer />
        </main>
    )
}