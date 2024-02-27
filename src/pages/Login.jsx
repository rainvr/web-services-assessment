// --- The Login Page of the Application --- //
import Header from "../assets/Header"
import Footer from "../assets/Footer"
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")

    console.log(emailInput, passwordInput)

    function handleSubmit(event) {
        event.preventDefault()

        alert(`The form has been submitted with email: ${emailInput} and password: ${passwordInput}`)
    }

    return (
        <main className="flex flex-col gap-4 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto overflow-y-scroll">
                <form onSubmit={handleSubmit} className="card-body card mx-auto w-96 bg-base-100 shadow-xl">
                    <h2 className="card-title justify-center mb-4">Login</h2>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="email"
                            name="email"
                            value={emailInput}
                            onChange={(event) => setEmailInput(event.target.value)}
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
                            value={passwordInput}
                            onChange={(event) => setPasswordInput(event.target.value)}
                            placeholder="Password"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            pattern="^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$"  // Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.
                            required />
                        <span className="invisible ml-1 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid password</span>
                    </label>
                    <button className="btn btn-primary">Login</button>
                    <p className="mx-auto">Not a member yet? <Link to="/register" className="link link-hover">Sign Up</Link></p>  {/* TODO: get link underline on hover */}
                </form>
            </section>
            <Footer />
        </main>
    )
}