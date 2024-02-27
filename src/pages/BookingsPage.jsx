// --- The Bookings Page of the Application --- //
import Header from "../assets/Header"
import Footer from "../assets/Footer"

function BookingsPage() {
    return (
        <main className="flex flex-col gap-4 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto overflow-y-scroll">
                <h1>Bookings</h1>
            </section>
            <Footer />
        </main>
    )
}

export default BookingsPage