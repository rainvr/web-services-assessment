// --- The Profile Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Users from "../../api/users"
import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../authentication"
import { useState } from "react"

function ProfilePage() {
    const [user, login, logout, refresh] = useAuthentication()
    const [statusMessage, setStatusMessage] = useState()
    const navigate = useNavigate()
    const [view, setView] = useState("profile")
    
    const [formData, setFormData] = useState({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        role: user.role,
        phone: user.phone,
        address: user.address,
        authenticationKey: user.authenticationKey
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
                <form onSubmit={handleSubmit} className="card-body card mx-auto w-80 sm:w-96 md:w-[500px] lg:w-[650px] bg-base-100 shadow-xl shadow-grey-500">
                    <h1 className="card-title justify-center mb-4">Profile</h1>
                    {/* --- Profile View --- */}
                    { view === "profile" ? <>
                        <h2 className="text-lg font-bold">First Name</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{user.firstname}</p>
                        <h2 className="text-lg font-bold">Last Name</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{user.lastname}</p>
                        <h2 className="text-lg font-bold">Email</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{user.email}</p>
                        <h2 className="text-lg font-bold">Password</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">*********</p>
                        <h2 className="text-lg font-bold">Role</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{user.role}</p>
                        <h2 className="text-lg font-bold">Phone</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{user.phone}</p>
                        <h2 className="text-lg font-bold">Address</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{user.address}</p>
                    </> : null }
                    {/* --- Edit View --- */}
                    { view === "edit" ? <>
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
                        <p className="bg-slate-100 p-4 rounded-lg">{user.email}</p>
                        <label className="text-lg font-bold">Password</label> 
                        <input className="bg-slate-100 p-4 rounded-lg"
                            type="password"
                            value={formData.password} 
                            onChange={(event) => setFormData(existingData => { return { ...existingData, password: event.target.value } } )}/>
                        <label className="text-lg font-bold">Role</label> 
                        <p className="bg-slate-100 p-4 rounded-lg">{user.role}</p>
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
                    </> : null }
                    <div className="flex flex-row justify-end gap-2"> 
                        {/* --- Status Message --- */}
                        <label className="label">
                            <span className="label-text-alt">{statusMessage}</span>
                        </label>
                        {/* --- Back Button --- */}
                        <button type="button" onClick={() => navigate(-1)} className="badge badge-outline font-semibold text-green-600 hover:bg-green-200 focus:bg-green-200  active:bg-green-200">Back</button> 
                        {/* --- Edit Button --- */}
                        { view === "profile" ? <button type="button" onClick={() => setView("edit")} className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Edit</button> : null }
                        {/* --- Save Button --- */}
                        { view === "edit" ? <button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200  active:bg-blue-200">Save</button> : null } 
                    </div>
            </form>
            </section>
            <Footer />
        </main>
    )
}

export default ProfilePage