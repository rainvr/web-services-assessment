// --- The Register Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as Users from "../../api/users"
import { useAuthentication } from "../authentication";

export default function RegisterPage() {
    const navigate = useNavigate()  // TODO: remove this?

    const [statusMessage, setStatusMessage] = useState("")
    const [user, login, logout, refresh] = useAuthentication()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "member", 
        phone: "",
        firstname: "",
        lastname: "",
        address: ""
    })

    async function handleSubmit(event) {
        try {
            event.preventDefault()
            setStatusMessage("Registering...")

            // TODO: loading/registering spinner

            // alert(`The form has been submitted with details: ${formData}`)  // TODO: remove this?
            
            // TODO: add validation for all fields
            
            // Register the user
            const result = await Users.register(formData)
            setStatusMessage(result.message)

            // If the email doesn't already exist in the database
            if (result.status != 400) {
                // Try to login the user and navigate home
                const nextResult = await login(formData.email, formData.password)
                setStatusMessage(nextResult.message)
                navigate("/")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <form onSubmit={handleSubmit} className="card-body card w-96 bg-base-100 shadow-xl">
                    <h2 className="card-title justify-center mb-4">Sign Up</h2>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            //name="first-name"
                            value={formData.firstname}
                            onChange={(event) => setFormData(existingData => { return { ...existingData, firstname: event.target.value } } )}
                            placeholder="First Name"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            // TODO: pattern ...  Checks the first name pattern
                            required />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid name</span>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            //name="last-name"
                            value={formData.lastname}
                            onChange={(event) => setFormData({ ...formData, lastname: event.target.value } )}
                            placeholder="Last Name"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            // TODO: pattern ...  Checks the last name pattern
                            required />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid last name</span>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="email"
                            //name="email"
                            value={formData.email}
                            onChange={(event) => setFormData(existingData => { return { ...existingData, email: event.target.value } } )}
                            placeholder="Email"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            pattern="^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$"  // Checks the email pattern
                            required />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid email</span>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="password"
                            //name="password"
                            value={formData.password}
                            onChange={(event) => setFormData(existingData => { return { ...existingData, password: event.target.value } } )}
                            placeholder="Password"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            pattern="^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$"  // Checks that a password has a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces.
                            required />
                        <span className="invisible ml-1 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid password</span>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            //name="phone"
                            value={formData.phone}
                            onChange={(event) => setFormData({ ...formData, phone: event.target.value } )}
                            placeholder="Phone Number"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            // TODO: pattern ...  Checks the phone number pattern
                        />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid phone number</span>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            //name="address"
                            value={formData.address}
                            onChange={(event) => setFormData({ ...formData, address: event.target.value } )}
                            placeholder="Address"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            // TODO: pattern ...  Checks the address pattern
                        />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid Address</span>
                    </label>
                     <button className="btn btn-primary">Register</button>
                    <p className="mx-auto">Already a member? <Link to="/login">Login</Link></p>  {/* TODO: get link underline on hover */}
                    <label className="label">
                        <span className="label-text-alt">{statusMessage}</span>
                    </label>
                </form>
            </section>
            <Footer />
        </main>
    )
}