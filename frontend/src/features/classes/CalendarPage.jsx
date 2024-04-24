// --- The Calendar Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Classes from "../../api/classes"
import * as Locations from "../../api/locations"
import { useEffect, useState } from "react"
import Day from "./Day"
import { addHours, previousMonday, isSameDay, format, formatISO9075, startOfWeek } from "date-fns"

function CalendarPage() {
    const [classes, setClasses] = useState([])

    const [locations, setLocations] = useState([])
    const [locationId, setLocationId] = useState(3)
    const [locationName, setLocationName] = useState("Brisbane City")

    const [weekStartDate, setWeekStartDate] = useState(addHours(startOfWeek(new Date(), { weekStartsOn: 1 }), 10).toISOString())
    const tuesDate = addHours(new Date(weekStartDate), 24)
    const wednesDate = addHours(new Date(weekStartDate), 48)
    const thursDate = addHours(new Date(weekStartDate), 72)
    const friDate = addHours(new Date(weekStartDate), 96)
    const saturDate = addHours(new Date(weekStartDate), 120)
    const sunDate = addHours(new Date(weekStartDate), 144)

    // Fetch all the locations
    useEffect(() => {
        async function fetchLocations() {
            try {
                const fetchedLocations = await Locations.getAll()

                if (fetchedLocations) {
                    setLocations(fetchedLocations)
                } else {
                    console.log("No locations returned")
                }
            } catch (error) {
                console.error("Error fetching locations:", error)
            }
        }
        fetchLocations()
    }, [])

    function selectLocation(location) {
        setLocationId(location.id)
        setLocationName(location.name)
    }

    // Fetch the classes (with location, trainer and activity data included) AND add the day field
    useEffect(() => {
        async function fetchClassesWithDay() {
            try {
                // Get all the classes from the db
                const fetchedClasses = await Classes.getWeek(weekStartDate, locationId)

                if (fetchedClasses) {
                    // Set the classes state as the classes returned
                    setClasses(fetchedClasses)
                } else {
                    console.log("No classes returned")
                }
            } catch (error) {
                console.error("Error fetching classes:", error)
            }
        }
        fetchClassesWithDay()
    }, [weekStartDate, locationId])

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto  w-80 sm:w-96 md:w-[450px] p-4 overflow-y-auto">
                <h1 className="text-xl font-bold text-center">Weekly Classes</h1>

                {/* ----- LOCATION SELECTOR ----- */}
                <div className="navbar">
                    <div className="navbar-start dropdown dropdown-right">
                        <div tabIndex={0} role="button" className="btn btn-sm btn-info btn-outline m-1">Location</div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            {/* Map the list of locations */}
                            {locations.map(location => (
                                <li key={location.id} onClick={() => selectLocation(location)}>
                                    <a>{location.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="navbar-end font-semibold text-sky-400">{locationName}</div>
                </div>
                
                <div className="divider mt-0 mb-2"></div> 

                {/* ----- MONDAY ----- */}
                {classes.length > 0 && <Day classes={classes} day="Monday" date={weekStartDate} />}
                {/* ----- TUESDAY ----- */}
                {classes.length > 0 && <Day classes={classes} day="Tuesday" date={tuesDate} />}
                {/* ----- WEDNESDAY ----- */}
                {classes.length > 0 && <Day classes={classes} day="Wednesday" date={wednesDate} />}
                {/* ----- THURSDAY ----- */}
                {classes.length > 0 && <Day classes={classes} day="Thursday" date={thursDate} />}
                {/* ----- FRIDAY ----- */}
                {classes.length > 0 && <Day classes={classes} day="Friday" date={friDate} />}
                {/* ----- SATURDAY ----- */}
                {classes.length > 0 && <Day classes={classes} day="Saturday" date={saturDate} />}
                {/* ----- SUNDAY ----- */}
                {classes.length > 0 && <Day classes={classes} day="Sunday" date={sunDate} />}

                {/* ----- PREVIOUS | NEXT ----- */}
                <div className="divider"></div> 
                <div className="join grid grid-cols-2">
                    <button className="join-item btn btn-outline btn-sm btn-success" onClick={()=>setWeekStartDate(addHours(weekStartDate, -168).toISOString())}>Previous week</button>
                    <button className="join-item btn btn-outline btn-sm btn-success" onClick={()=>setWeekStartDate(addHours(weekStartDate, 168).toISOString())}>Next week</button>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default CalendarPage