import * as Users from "../../api/users"
import { useState, useEffect } from "react"

function UsersListPage() {

    // TODO: refresh trigger for on Save
    const [users, setUsers] = useState([])
    const [userId, setUserId] = useState()

    useEffect(() => {
        const users = Users.getAll()
            .then(users => {
                setUsers(users)
            })
    }, [])  // TODO: refresh trigger dependency

    return (
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
    )
}

export default UsersListPage