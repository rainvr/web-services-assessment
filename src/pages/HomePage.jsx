// --- The Home Page of the Application --- //
import Header from "../assets/Header"
import Footer from "../assets/Footer"

function HomePage() {
    return (
        <main className="flex flex-col gap-4 h-screen">
            <Header />
            <section className="flex-1 mx-auto">
                <h1>Home Page</h1>
            </section>
            <Footer />
        </main>
    )
}

export default HomePage