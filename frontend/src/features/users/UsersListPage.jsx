import * as Users from "../../api/users"
import { useState, useEffect } from "react"
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useAuthentication } from "../authentication"
import { useNavigate } from "react-router-dom"

function UsersListPage() {
    const [user, login, logout, refresh] = useAuthentication()
    const navigate = useNavigate()

    // TODO: refresh trigger for on Save
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState()

    // const fetchUsers = async () => {
    //     try {
    //         const users = await Users.getAll(user.authenticationKey)
    //         if (users) {  // If we have some users returned
    //             setUsers(users)  // Set the users state as the users returned
    //         } else {
    //             console.log("No users returned")  // TODO: remove test
    //             // return <div>No users returned</div>  // TODO: remove??
    //         }
    //     } catch (error) {
    //         console.error("Error fetching users:", error) // TODO: remove test
    //         // return <div>Error fetching users: {error.message}</div> // TODO: remove??
    //     }
    // }

    useEffect(() => {
        if (!user) {
            return // Return early if the authenticated user is null
        }
        
        const fetchUsers = async () => {
            try {
                const users = await Users.getAll(user.authenticationKey)
                if (users) {  // If we have some users returned
                    setUsers(users)  // Set the users state as the users returned
                } else {
                    console.log("No users returned")  // TODO: remove test
                    // return <div>No users returned</div>  // TODO: remove??
                }
            } catch (error) {
                console.error("Error fetching users:", error) // TODO: remove test
                // return <div>Error fetching users: {error.message}</div> // TODO: remove??
            }
        }
    
        fetchUsers()
    }, [user.authenticationKey]) // Only re-run the effect if user changes ( see 2nd wk 5&6 video 1:26:30 )
        

    async function deleteThisUser(userId) {
        console.log("Trying to delete user with ID: " + userId) // TODO: remove test
        
        const result = await Users.deleteById(userId, user.authenticationKey)
        console.log(user.authenticationKey)
        console.log(result)

        const fetchUsers = async () => {
            try {
                const users = await Users.getAll(user.authenticationKey)
                if (users) {  // If we have some users returned
                    setUsers(users)  // Set the users state as the users returned
                } else {
                    console.log("No users returned")  // TODO: remove test
                    // return <div>No users returned</div>  // TODO: remove??
                }
            } catch (error) {
                console.error("Error fetching users:", error) // TODO: remove test
                // return <div>Error fetching users: {error.message}</div> // TODO: remove??
            }
        }
        fetchUsers()
    }

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Role</th>
                        <th>Full Name</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(thisUser => 
                        <tr key={thisUser.id}>
                            <td>{thisUser.id}</td>
                            <td>{thisUser.email}</td>
                            <td>{thisUser.password}</td>
                            <td>{thisUser.role}</td>
                            <td>{thisUser.firstname} {thisUser.lastname}</td>
                            <td>{thisUser.address}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => navigate(`/edit-user`, {state: thisUser})}>Edit</button>
                                <button className="btn btn-error ml-2" onClick={() => deleteThisUser(thisUser.id)}>Delete</button>
                            </td>
                        </tr>
                    )}
                </tbody>
                {/* Either list the user to edit (i.e. call an editUser component) or navigate to an editUserPage */}
            </table>
            <Footer />
        </main>
    )
}

export default UsersListPage