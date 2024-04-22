// --- The Home Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../authentication"

function HomePage() {
    const navigate = useNavigate()
    const [user] = useAuthentication()

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 hero bg-portrait-background md:bg-landscape-background">
                <div className="hero-overlay bg-opacity-60"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div className="max-w-md">
                        <h1 className="mb-5 text-5xl font-bold">Transform your fitness</h1>
                        <p className="mb-5">Welcome to High Street Gym, your ultimate destination for achieving your fitness goals. With top-notch facilities and expert guidance, we're here to empower you on your journey to a stronger, healthier you.</p>
                        { user ? <button className="btn btn-primary" onClick={()=>navigate("/profile")}>Profile</button>
                        : <button className="btn btn-primary" onClick={()=>navigate("/register")}>Register</button> }
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default HomePage