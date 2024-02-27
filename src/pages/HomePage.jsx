// --- The Home Page of the Application --- //
import Header from "../assets/Header"
import Footer from "../assets/Footer"

function HomePage() {
    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <h1>Home Page</h1>
            </section>
            <Footer />
        </main>
    )
}

export default HomePage