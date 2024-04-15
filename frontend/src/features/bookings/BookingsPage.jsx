// --- The Calendar Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Bookings from "../../api/bookings"
import { useEffect, useState } from "react"
import Location from "../../features/bookings/Location"
import { addHours, previousMonday, isSameDay, format, formatISO9075, startOfWeek, getDay } from "date-fns"
import { useAuthentication } from "../authentication"

function BookingsPage() {
    const [user] = useAuthentication()
    const [bookings, setBookings] = useState([])
    const [statusMessage, setStatusMessage] = useState("")

    // const formattedTime = format(new Date(booking.classDatetime), 'hh:mm bbb')

    const [locations, setLocations] = useState([])
    const [locationId, setLocationId] = useState(3)
    const [locationName, setLocationName] = useState("Brisbane City")

    async function cancel(bookingId) {
        try {
            const cancelled = await Bookings.deleteById(bookingId, user.authenticationKey)
            if (cancelled) {
                setStatusMessage("Success! " + cancelled.message)
                location.reload()  // Reload the window after the booking was deleted (to display the resulting array of bookings)
            } else {
                setStatusMessage("Error: " + cancelled.message)
            }
        } catch (error) {
            console.log("Error cancelling the booking", error)
        }
    }

    // Fetch the bookings (with location, trainer and activity data included)
    useEffect(() => {
        async function fetchBookings() {
            try {
                //setStatusMessage("Updating...")  // TODO: set status message
    
                // Get all the bookings from the db
                    console.log(user) // TODO: remove test
                    const fetchedBookings = await Bookings.getAll(user.id, user.authenticationKey)
                    
                    if (fetchedBookings) {
                        // Set the bookings state as the bookings returned
                        setBookings(fetchedBookings)
                
                } else {
                    console.log("No bookings returned")
                }
            } catch (error) {
                console.error("Error fetching bookings:", error)
            }
        }
        fetchBookings()
    }, [user])

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-auto">
                <h1 className="text-xl font-bold text-center">Your Bookings</h1>
                
                <div className="divider mt-0 mb-2"></div> 
                
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Location</th>
                            <th>Activity</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map the bookings */}
                        {bookings
                            .sort((a, b) => new Date(b.classDatetime) - new Date(a.classDatetime))
                            .reverse()
                            .map(booking => (
                                <tr className="hover" key={booking.id}>
                                    <th></th>
                                    <td>{booking.locationName}</td>
                                    <td>{booking.activityName}</td>
                                    <td>{format(new Date(booking.classDatetime), 'EEE do LLL')}</td>
                                    <td>{format(new Date(booking.classDatetime), 'hh:mm bbb')}</td>
                                    <td><button type="submit" onClick={()=> cancel(booking.id)} className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200 active:bg-red-200">Cancel</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                <div><span>{statusMessage}</span></div>
                
            </section>
            <Footer />
        </main>
    )
}

export default BookingsPage