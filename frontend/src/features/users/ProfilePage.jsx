// --- The Profile Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Users from "../../api/users"
import { Link, useNavigate } from "react-router-dom"
import { useAuthentication } from "../authentication"
import { useState } from "react"

function ProfilePage() {
    const [authObject, login, logout, refresh] = useAuthentication()
    const [statusMessage, setStatusMessage] = useState()
    const navigate = useNavigate()
    const [view, setView] = useState("profile")
    
    const [formData, setFormData] = useState({
        id: authObject.user.id,
        firstname: authObject.user.firstname,
        lastname: authObject.user.lastname,
        email: authObject.user.email,
        password: authObject.user.password,
        role: authObject.user.role,
        phone: authObject.user.phone,
        address: authObject.user.address,
        authKey: authObject.user.authKey
    })
    
    async function handleSubmit(event) {
        try {
            event.preventDefault()
            setStatusMessage("Updating...")

            // TODO: loading/registering spinner

            // alert(`The form has been submitted with details: ${formData}`)  // TODO: remove this?
            
            // TODO: add validation for all fields
            
            // Updated the user
            console.log(formData)  // TODO: remove test
            console.log(authObject)  //  TODO: remove test
            const result = await Users.update(formData, authObject.user.authKey)
            console.log(result)
            setStatusMessage(result.message)
            
            // TODO: check if If the new email doesn't already exist in the database
            // if (result.status != 400) {
            //     // Try to login the user and navigate home
            //     const nextResult = await login(formData.email, formData.password)
            //     setStatusMessage(nextResult.message)
            //     navigate("/")
            // }
            
        } catch (error) {
            console.log(error)
        }
    } 

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <h1 className="text-xl font-bold">Profile</h1>
                <form onSubmit={handleSubmit} className="card-body card mx-auto w-96 bg-base-100 shadow-xl shadow-grey-500">
                    {/* --- Profile View --- */}
                    { view === "profile" ? <>
                        <h2 className="text-lg font-bold">First Name</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.firstname}</p>
                        <h2 className="text-lg font-bold">Last Name</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.lastname}</p>
                        <h2 className="text-lg font-bold">Email</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.email}</p>
                        <h2 className="text-lg font-bold">Password</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.password}</p>
                        <h2 className="text-lg font-bold">Role</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.role}</p>
                        <h2 className="text-lg font-bold">Phone</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.phone}</p>
                        <h2 className="text-lg font-bold">Address</h2> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.address}</p>
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
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.email}</p>
                        {/* TODO: should I ever allow email to be edited? */}
                        {/* <input className="bg-slate-100 p-4 rounded-lg" 
                            type="email"
                            value={formData.email} 
                            onChange={(event) => setFormData(existingData => { return { ...existingData, email: event.target.value } } )}/> */}
                        <label className="text-lg font-bold">Password</label> 
                        <input className="bg-slate-100 p-4 rounded-lg"
                            type="text"
                            value={formData.password} 
                            onChange={(event) => setFormData(existingData => { return { ...existingData, password: event.target.value } } )}/>
                        <label className="text-lg font-bold">Role</label> 
                        <p className="bg-slate-100 p-4 rounded-lg">{authObject.user.role}</p>
                        {/* TODO: if the role is manager allow below input, otherwise allow above p */}
                        {/* <input className="bg-slate-100 p-4 rounded-lg"
                            type="text"
                            value={formData.role} 
                            onChange={(event) => setFormData(existingData => { return { ...existingData, role: event.target.value } } )} /> */}
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
                    <div className="flex flex-row justify-end gap-2"> {/* TODO: toggle visibility if the blog belong's to the user */}
                        {/* --- Status Message --- */}
                        <label className="label">
                            <span className="label-text-alt">{statusMessage}</span>
                        </label>
                        {/* --- Back Button --- */}
                        <button type="button" onClick={() => navigate(-1)} className="badge badge-outline font-semibold text-green-600 hover:bg-green-200 focus:bg-green-200  active:bg-green-200">Back</button> 
                        {/* --- Edit Button --- */}
                        { view === "profile" ? <button type="button" onClick={() => setView("edit")} className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Edit</button> : null }
                        {/* --- Refresh Button --- */}
                        { view === "edit" ? <button type="button" onClick={
                            () => {
                                // if (!authObject) {
                                // setStatusMessage("Loading...")
                                // } 
                                alert(`refresh clicked. authObject: ${JSON.stringify(authObject, null, 2)}`)
                                refresh()
                            }
                        } className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Refresh</button> : null }
                        {/* --- Save Button --- */}
                        { view === "edit" ? <button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200  active:bg-blue-200">Save</button> : null } 
                        {/* --- Delete Button --- */}
                        {/* <button onClick={() => } className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200  active:bg-red-200">Delete</button>  TODO: create & use the deleteBlog model/controller */}
                    </div>
            </form>
            </section>
            <Footer />
        </main>
    )
}

export default ProfilePage