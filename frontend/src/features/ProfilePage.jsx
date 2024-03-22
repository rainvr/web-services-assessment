// --- The Profile Page of the Application --- //
import Header from "../common/components/Header"
import Footer from "../common/components/Footer"
import { useState, useEffect } from "react"
import { getUserByEmail, login } from "../api/users.js"
import { useLocation } from "react-router-dom"

const location = useLocation()

function ProfilePage() {
    // const [user, setUser] = useState([{  // TODO: Input Authentication for the current user
    //     "id": 3,
    //     "email": "anything@email.com",
    //     "password": "123",
    //     "role": "trainer",
    //     "phone": "12345678",
    //     "firstname": "Testfirst",
    //     "lastname": "Testsecond",
    //     "address": "3 Middle Avenue"
    // }])
    const userFromLogin = user
    const [user, setUser] = useState([userFromLogin])  // TODO: This avoids authentication... need to fix it up

    useEffect(() => {
        // TODO: fetch the user
        getUserByEmail(user.email).then(user => {
            setUser(user)
        })
    })

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <h1>Profile</h1>
                <h2>User:</h2>
                {user.map(user => <p>ID: {user.id}<br />Name: {user.firstname} {user.lastname}<br />Email: {user.email}</p>)}
            </section>
            <Footer />
        </main>
    )
}

export default ProfilePage