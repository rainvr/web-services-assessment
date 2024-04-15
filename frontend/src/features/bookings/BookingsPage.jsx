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

    // const formattedTime = format(new Date(booking.classDatetime), 'hh:mm bbb')

    const [locations, setLocations] = useState([])
    const [locationId, setLocationId] = useState(3)
    const [locationName, setLocationName] = useState("Brisbane City")

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

                {/* ----- LOCATION SELECTOR ----- */}
                {/* <div className="navbar">
                    <div className="navbar-start dropdown dropdown-right">
                        <div tabIndex={0} role="button" className="btn btn-sm btn-info btn-outline m-1">Location</div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            {locations.map(location => (
                                <li key={location.id} onClick={() => selectLocation(location)}>
                                    <a>{location.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="navbar-end font-semibold text-sky-400">{locationName}</div>
                </div> */}
                
                <div className="divider mt-0 mb-2"></div> 
                
                {/* ----- FOR EACH LOCATION ----- */}
                {/* <h2 className="text-xl font-bold">Locations</h2>
                {bookings.length > 0 && 
                    bookings
                        .filter(booking => booking.locationId === 1)
                        .map(booking => (
                        <div>{booking.id} {booking.locationName} {format(new Date(booking.classDatetime), 'EEE do LLL')} {format(new Date(booking.classDatetime), 'hh:mm bbb')} {booking.activityName}</div>
                    ))
                }
                
                <div className="divider mt-0 mb-2"></div>  */}

                {/* ----- FOR EACH DAY OF THE WEEK ----- */}
                {/* <h2 className="text-xl font-bold">Days of the Week</h2> */}

                {/* ----- MONDAY ----- */}
                {/* <h2 className="text-xl font-bold">MONDAY</h2>
                {bookings.length > 0 && 
                    bookings
                        .filter(booking => getDay(booking.classDatetime) === 1)
                        .map(booking => (
                        <div>{booking.locationName} - {format(new Date(booking.classDatetime), 'EEE do LLL')}, {format(new Date(booking.classDatetime), 'hh:mm bbb')} - {booking.activityName}</div>
                    ))
                }

                <div className="divider mt-0 mb-2"></div>  */}

                {/* ----- SORTED ----- */}
                {/* <h2 className="text-xl font-bold">Sorted</h2>
                {bookings.length > 0 && 
                    bookings
                        .sort((a, b) => new Date(b.classDatetime) - new Date(a.classDatetime))
                        .reverse()
                        .map(booking => (
                        <div>{booking.locationName} - {format(new Date(booking.classDatetime), 'EEE do LLL')}, {format(new Date(booking.classDatetime), 'hh:mm bbb')} - {booking.activityName}</div>
                    ))
                } */}
                
                
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
                                <tr className="hover">
                                    <th></th>
                                    <td>{booking.locationName}</td>
                                    <td>{booking.activityName}</td>
                                    <td>{format(new Date(booking.classDatetime), 'EEE do LLL')}</td>
                                    <td>{format(new Date(booking.classDatetime), 'hh:mm bbb')}</td>
                                    <td><button type="submit" onClick={() => navigate(`/cancel-booking`, { state: { booking } })} className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200 active:bg-red-200">Cancel</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                


                
                
            </section>
            <Footer />
        </main>
    )
}

export default BookingsPage