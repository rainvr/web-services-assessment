// --- The Calendar Page of the Application --- //
import Header from "../assets/Header"
import Footer from "../assets/Footer"

function Calendar() {
    return (
        <main className="flex flex-col gap-4 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto overflow-y-scroll">
                <h1>Calendar</h1>
            </section>
            <Footer />
        </main>
    )
}

export default Calendar