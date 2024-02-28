// --- The Calendar Page of the Application --- //
import Header from "../common/components/Header"
import Footer from "../common/components/Footer"

function CalendarPage() {
    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <h1>Calendar</h1>
            </section>
            <Footer />
        </main>
    )
}

export default CalendarPage