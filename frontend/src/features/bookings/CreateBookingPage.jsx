// --- The Register Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as Classes from "../../api/classes"
import * as Locations from "../../api/locations"
import * as Bookings from "../../api/bookings"
import { useAuthentication } from "../authentication"
import { format, formatISO9075 } from "date-fns"

export default function CreateBookingPage() {
    const navigate = useNavigate()
    const location = useLocation()

    const [statusMessage, setStatusMessage] = useState("")
    const [user, login, logout, refresh] = useAuthentication()
    const [classes, setClasses] = useState([])
    const [uniqueClass, setUniqueClass] = useState({})
    const [formData, setFormData] = useState({})
    const [selector, setSelector] = useState("unselected")

    async function fetchClasses() {
        try {
            // Get all the classes from the db by location, date and activity
            const fetchedClasses = await Classes.getByLDA(location.state.clazz.locationId, location.state.clazz.date, location.state.clazz.activityId, user.authenticationKey)

            if (fetchedClasses) {
                setClasses(fetchedClasses)
                // Get an object with the unique fields (uniqueClass)
                setUniqueClass(fetchedClasses[0])
            } else {
                console.log("No classes returned")
            }
        } catch (error) {
            console.error("Error fetching classes:", error)
        }
    }
    
    // Upon page load retrieve the list of classes by the location, date and activity
    useEffect(()=> {
        fetchClasses()
    }, [])

    function makeClassToBook(clazz) {
        setFormData({
            userId: user.id,
            classId: clazz.classId,
            createDate: formatISO9075(new Date())
        })
        setUniqueClass(clazz)
        setSelector("selected")
    }

    async function handleSubmit(event) {
        try {
            event.preventDefault()
            setStatusMessage("Booking...")
            
            // Create the booking
            const result = await Bookings.create(formData, user.authenticationKey)
            setStatusMessage(result.message)

            // If the booking was successful, navigate to the user's bookings page
            if (result.status === 200) {
                navigate("/bookings")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <form onSubmit={handleSubmit} className="card-body card w-96 bg-base-100 shadow-xl">
                    <h2 className="card-title justify-center mb-4">Book a Class</h2>
                    <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                        <div className="flex flex-row justify-between w-full">
                            {uniqueClass && <h2 className="text-lg font-bold">{uniqueClass.locationName}</h2>}
                            <h2 className="text-lg font-semibold">{format(new Date(location.state.clazz.date), 'EEE do LLL')}</h2>
                        </div>
                    </div>
                    {uniqueClass && <>
                        <h3 className="pl-4"><strong>Class: </strong>{uniqueClass.activityName}</h3>
                        <p className="pl-4"><strong>Duration: </strong>{uniqueClass.activityDuration} minutes</p>
                        <p className="pl-4">{uniqueClass.activityDescription}</p>
                        {/* ----- TIME SELECTOR ----- */}
                        <div className="navbar">
                            <div className="navbar-start dropdown dropdown-right">
                                <div tabIndex={0} role="button" className="btn btn-sm btn-info btn-outline m-1">{selector == "selected" ? "Time" : "Select Time"}</div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
    
                                    {classes.map(clazz => (
                                        <li key={clazz.classId} onClick={() => makeClassToBook(clazz)}>
                                            <a>{clazz.classTime}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="navbar-end font-semibold text-sky-400">{selector == "selected" ? uniqueClass.classTime : null}</div>
                        </div>
                        {/* ---- Show the trainer if a time is selected ---- */}
                        {selector == "selected" ? 
                            <p className="pl-4"><strong>Trainer: </strong>{uniqueClass.trainerName}</p> 
                        : 
                            <p className="pl-4 text-sky-400">Please select a time to see the trainer</p>
                        }
                    </> }

                    <div className="divider"></div>
                    
                    <div className="flex flex-row justify-end gap-2">
                        <span className="label-text-alt">{statusMessage}</span>
                        <button type="button" onClick={()=>navigate('/calendar')} className="badge badge-lg badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Cancel</button>
                        <button type="submit" className="badge badge-lg badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200  active:bg-blue-200">Book</button>
                        </div>
                    
                </form>
            </section>
            <Footer />
        </main>
    )
}