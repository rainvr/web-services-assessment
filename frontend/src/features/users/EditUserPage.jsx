// --- The Edit User Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Users from "../../api/users"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuthentication } from "../authentication"
import { useState } from "react"

function EditUserPage() {
    const [user, login, logout, refresh] = useAuthentication()
    const [statusMessage, setStatusMessage] = useState()
    const navigate = useNavigate()
    const location = useLocation()

    const [formData, setFormData] = useState({
        id: location.state.id,
        firstname: location.state.firstname,
        lastname: location.state.lastname,
        email: location.state.email,
        password: location.state.password,
        role: location.state.role,
        phone: location.state.phone,
        address: location.state.address,
        authenticationKey: location.state.authenticationKey
    })

    async function handleSubmit(event) {
        try {
            event.preventDefault()
            setStatusMessage("Updating...")
            
            // Updated the user
            const result = await Users.update(formData, user.authenticationKey)
            refresh()
            setStatusMessage(result.message)
            
        } catch (error) {
            console.log(error)
        }
    } 

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <h1 className="text-xl font-bold">Edit User</h1>
                <form onSubmit={handleSubmit} className="card-body card mx-auto w-80 sm:w-96 md:w-[500px] lg:w-[650px] bg-base-100 shadow-xl shadow-grey-500">        
                    <label className="text-lg font-bold">First Name</label> 
                    <input className="bg-slate-100 p-4 rounded-lg" 
                        type="text"
                        value={formData.firstname} 
                        onChange={(event) => setFormData(existingData => { return { ...existingData, firstname: event.target.value } } )}/>
                    <label className="text-lg font-bold">Last Name</label> 
                    <input className="bg-slate-100 p-4 rounded-lg" 
                        type="text"
                        value={formData.lastname} 
                        onChange={(event) => setFormData(existingData => { return { ...existingData, lastname: event.target.value } } )}/>
                    <label className="text-lg font-bold">Email</label> 
                    <p className="bg-slate-100 p-4 rounded-lg">{formData.email}</p>
                    <label className="text-lg font-bold">Password</label> 
                    <input className="bg-slate-100 p-4 rounded-lg"
                        type="password"
                        value={formData.password} 
                        onChange={(event) => setFormData(existingData => { return { ...existingData, password: event.target.value } } )}/>
                    <label className="text-lg font-bold">Role</label> 
                    <p className="bg-slate-100 p-4 rounded-lg">{formData.role}</p>
                    <label className="text-lg font-bold">Phone</label> 
                    <input className="bg-slate-100 p-4 rounded-lg"
                        type="text"
                        value={formData.phone} 
                        onChange={(event) => setFormData(existingData => { return { ...existingData, phone: event.target.value } } )}/>
                    <label className="text-lg font-bold">Address</label> 
                    <input className="bg-slate-100 p-4 rounded-lg"
                        type="text"
                        value={formData.address} 
                        onChange={(event) => setFormData(existingData => { return { ...existingData, address: event.target.value } } )}/>
                    <div className="flex flex-row justify-end gap-2"> 
                        {/* --- Status Message --- */}
                        <label className="label">
                            <span className="label-text-alt">{statusMessage}</span>
                        </label>
                        {/* --- Back Button --- */}
                        <button type="button" onClick={() => navigate(-1)} className="badge badge-outline font-semibold text-green-600 hover:bg-green-200 focus:bg-green-200  active:bg-green-200">Back</button> 
                        {/* --- Save Button --- */}
                        <button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200  active:bg-blue-200">Save</button> 
                    </div>
                </form>
            </section>
            <Footer />
        </main>
    )
}

export default EditUserPage