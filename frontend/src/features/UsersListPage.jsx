import Header from "../common/components/Header.jsx";
import Footer from "../common/components/Footer.jsx";
import { useState, useEffect } from "react"
import { getAllUsers } from "../api/users.js";

export default function UsersListPage() {

const [usersList, setUsersList] = useState([])

useEffect(() => {
    // Fetch the user list
    getAllUsers().then(users => {
        setUsersList(users)
    })
})

    return (
        <main>
            <Header />
                <section>
                    <h1>All Users</h1>
                    {usersList.map(user => <p>User {user.id}: {user.firstname} {user.lastname}</p>)}
                </section>
            <Footer />
        </main>
    )
}