import * as Users from "../../api/users"
import { useState, useEffect } from "react"
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useAuthentication } from "../authentication"

function UsersListPage() {
    const [userObject, login, logout, refresh] = useAuthentication()

    // TODO: refresh trigger for on Save
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState()

        useEffect(() => {
            if (!userObject) {
                return // Return early if the authenticated userObject is null
            }
            
            const fetchUsers = async () => {
                try {
                    const users = await Users.getAll(userObject.user.authKey)
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
            };
        
            fetchUsers()
        }, [userObject]) // Only re-run the effect if userObject changes ( see 2nd wk 5&6 video 1:26:30 )
        

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
                    {users.map(user => 
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.password}</td>
                            <td>{user.role}</td>
                            <td>{user.firstname} {user.lastname}</td>
                            <td>{user.address}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => setUserId(user.id)}>Edit</button>
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