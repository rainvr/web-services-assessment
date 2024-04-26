import * as Users from "../../api/users"
import { useState, useEffect } from "react"
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useAuthentication } from "../authentication"
import { useNavigate } from "react-router-dom"

function UsersListPage() {
    const [user, login, logout, refresh] = useAuthentication()
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [statusMessage, setStatusMessage] = useState("")

    const fetchUsers = async () => {
        try {
            const users = await Users.getAll(user.authenticationKey)
            if (users) {  // If we have some users returned
                setUsers(users)  // Set the users state as the users returned
            } else {
                console.log("No users returned")  
            }
        } catch (error) {
            console.error("Error fetching users:", error) 
        }
    }
    
    useEffect(() => {
        if (!user) {
            return // Return early if the authenticated user is null
        }
        fetchUsers()
    }, [user.authenticationKey]) // Only re-run the effect if user changes 
        

    async function deleteThisUser(userId) {
        const result = await Users.deleteById(userId, user.authenticationKey)
        setStatusMessage("Success! " + result.message)
        fetchUsers()
    }

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />

            <section className="flex-1 mx-auto p-4 overflow-y-auto">
                <h1 className="text-xl font-bold text-center">Users</h1>
                <div className="divider mt-0 mb-2"></div> 
                {/* ---- STATUS MESSAGE ---- */}
                { statusMessage != "" &&
                    <div role="alert" className="alert mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>{statusMessage}</span>
                        <div>
                            <button onClick={()=>setStatusMessage("")} className="btn btn-sm btn-primary">Close</button>
                        </div>
                    </div>
                }
                {/* ---- BOOKINGS LIST ---- */}
                {users.map(thisUser => 
                    <article key={thisUser.id} className="card-body card w-80 sm:w-96 md:w-[500px] lg:w-[650px]  mb-4 bg-base-100 shadow-xl">
                        <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                            <div className="flex flex-row justify-between w-full">
                                {thisUser && <h2 className="text-lg font-bold">{thisUser.firstname} {thisUser.lastname}</h2>}
                                <h2 className="text-lg font-normal">{thisUser.id}</h2>
                            </div>
                        </div>
                        {thisUser && <>
                            <p className="pl-4"><strong>Email: </strong>{thisUser.email}</p>
                            <p className="pl-4"><strong>Role: </strong>{thisUser.role}</p>
                            <p className="pl-4"><strong>Phone: </strong>{thisUser.phone}</p>
                            <p className="pl-4"><strong>Address: </strong>{thisUser.address}</p>
                        </> }
                        {/* ---- CANCEL BUTTON ---- */}
                        <div className="flex flex-row justify-end gap-2">
                            <button type="button" onClick={() => navigate(`/edit-user`, {state: thisUser})} className="badge badge-lg badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Edit</button>
                            { user.id != thisUser.id && <button type="button" onClick={() => deleteThisUser(thisUser.id)} className="badge badge-lg badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200  active:bg-red-200">Delete</button> }
                        </div> 
                    </article>
                )}
            </section>
            <Footer />
        </main>
    )
}

export default UsersListPage