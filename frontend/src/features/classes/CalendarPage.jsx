// --- The Calendar Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Classes from "../../api/classes"
import { useEffect, useState } from "react"
import Day from "../../common/components/Day"
import { addHours, previousMonday, isSameDay, format, formatISO9075, startOfWeek } from "date-fns"

function CalendarPage() {
    const [classes, setClasses] = useState([])
    const [locations, setLocations] = useState([
        {id: 1, name: "Chermside"},
        {id: 2, name: "Indooroopilly"},
        {id: 3, name: "Brisbane City"}
    ])
    // const [locations, setLocations] = useState([])
    const [weekStartDate, setWeekStartDate] = useState(addHours(startOfWeek(new Date(), { weekStartsOn: 1 }), 10).toISOString())
    const [locationId, setLocationId] = useState(3)
    const tuesDate = addHours(new Date(weekStartDate), 24)
    const wednesDate = addHours(new Date(weekStartDate), 48)
    const thursDate = addHours(new Date(weekStartDate), 72)
    const friDate = addHours(new Date(weekStartDate), 96)
    const saturDate = addHours(new Date(weekStartDate), 120)
    const sunDate = addHours(new Date(weekStartDate), 144)

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

    // Set the locations list for the classes that exist
    // TODO: need to change this to fetch locations from the locations table
    // useEffect(() => {
    //     if (classes.length > 0) {
    //         const uniqueLocationsMap = new Map(classes.map(clazz => [clazz.locationId, clazz.locationName]))
    //         const uniqueLocations = Array.from(uniqueLocationsMap, ([locationId, locationName]) => ({ id: locationId, name: locationName }))
    //         setLocations(uniqueLocations)
            
    //     }
    // }, [classes])
    

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-auto">
                <h1>Calendar</h1>
                {/* ----- Selection location dropdown ----- */}
                <div className="dropdown dropdown-right">
                    <div tabIndex={0} role="button" className="btn m-1">Location</div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        {/* Map the list of unique locations */}
                        {locations.map(location => (
                            <li key={location.id} onClick={()=>setLocationId(location.id)}><a>{location.name}</a></li>
                        ))}
                    </ul>
                </div>
                <div className="divider"></div> 

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



                {/* <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                    <h2 className="text-lg font-bold">Monday</h2>
                    <h3 className="text-md pt-1">{weekStartDate}</h3>
                </div>
                <table className="table">

                    <thead>
                        <tr>
                            <th></th>
                            <th>Activity</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {classes
                            .filter(clazz => isSameDay(addHours(new Date(clazz.datetime), -10), new Date(weekStartDate)))
                            .map(clazz => (
                                <Day key={clazz.id} clazz={clazz} />
                            ))}
                    </tbody>
                </table> */}
                <div className="divider"></div> 
                <div className="join grid grid-cols-2">
                    <button className="join-item btn btn-outline" onClick={()=>setWeekStartDate(addHours(weekStartDate, -168).toISOString())}>Last week</button>
                    <button className="join-item btn btn-outline" onClick={()=>setWeekStartDate(addHours(weekStartDate, 168).toISOString())}>Next week</button>
                </div>
            </section>
            <Footer />
        </main>
    )
}

export default CalendarPage