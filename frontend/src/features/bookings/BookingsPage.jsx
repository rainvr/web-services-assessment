// --- The Calendar Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Bookings from "../../api/bookings"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useAuthentication } from "../authentication"

function BookingsPage() {
    const [user] = useAuthentication()
    const [bookings, setBookings] = useState([])
    const [statusMessage, setStatusMessage] = useState("")

    // Fetch the bookings (with location, trainer and activity data included)
    async function fetchBookings() {
        try {
            // Get all the bookings from the db
            const fetchedBookings = await Bookings.getAll(user.id, user.authenticationKey)
            
            if (fetchedBookings) {
                // Set the bookings state as the bookings returned
                setBookings(fetchedBookings)
                
            } else {
                setBookings([])
                console.log("No bookings returned")
            }
        } catch (error) {
            console.error("Error fetching bookings:", error)
        }
    }

    async function cancel(bookingId) {
        try {
            const cancelled = await Bookings.deleteById(bookingId, user.authenticationKey)
            if (cancelled) {
                setStatusMessage("Success! " + cancelled.message)
                fetchBookings()
            }
        } catch (error) {
            console.log("Error cancelling the booking", error)
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [user])

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-auto">
                <h1 className="text-xl font-bold text-center">Your Bookings</h1>
                <div className="divider mt-0 mb-2"></div> 
                {/* ---- NO BOOKINGS MESSAGE ---- */}
                { bookings.length == 0 && <>
                    <p className="text-md font-normal text-center">You have no bookings.</p>
                    <p className="text-md font-normal text-center">Please go to the calendar to make a booking.</p>
                </> }
                {/* ---- STATUS MESSAGE ---- */}
                { statusMessage != "" &&
                    <div role="alert" className="alert mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>{statusMessage}</span>
                        <div>
                            <button onClick={()=>setStatusMessage("")} className="btn btn-sm btn-primary">Close</button>
                        </div>
                    </div>
                }
                {/* ---- BOOKINGS LIST ---- */}
                {bookings.map(booking => 
                    <form key={booking.id} className="card-body card w-80 sm:w-96 md:w-[500px] lg:w-[650px]  mb-4 bg-base-100 shadow-xl">
                        {/* <h2 className="card-title justify-center mb-4">Your Booking</h2> */}
                        <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                            <div className="flex flex-row justify-between w-full">
                                {booking && <h2 className="text-lg font-bold">{booking.locationName}</h2>}
                                <h2 className="text-lg font-semibold">{format(new Date(booking.classDatetime), 'EEE do LLL')}</h2>
                            </div>
                        </div>
                        {booking && <>
                            <h3 className="pl-4"><strong>Class: </strong>{booking.activityName}</h3>
                            <p className="pl-4">{booking.activityDescription}</p>
                            <p className="pl-4"><strong>Time: </strong>{format(new Date(booking.classDatetime), 'hh:mm bbb')}</p>
                            <p className="pl-4"><strong>Trainer: </strong>{booking.trainerName}</p>
                        </> }
                        {/* ---- CANCEL BUTTON ---- */}
                        <div className="flex flex-row justify-end gap-2">
                            <button type="button" onClick={() => cancel(booking.id)} className="badge badge-lg badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Cancel</button>
                        </div>
                        
                    </form>
                )}
            </section>
            <Footer />
        </main>
    )
}

export default BookingsPage