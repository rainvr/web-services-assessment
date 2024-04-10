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
    const [weekStartDate, setWeekStartDate] = useState(addHours(startOfWeek(new Date(), { weekStartsOn: 1 }), 10).toISOString())  // TODO: did have at the end... but it was an issue // .toISOString()
    const [locationId, setLocationId] = useState(3)

    // Fetch the classes (with location, trainer and activity data included) AND add the day field
    useEffect(() => {
        async function fetchClassesWithDay() {
            try {
                // Get all the classes from the db
                const fetchedClasses = await Classes.getWeek(weekStartDate, locationId)
                // console.log(weekStartDate)  //TODO: remove test

                // TODO: remove test (working)
                // if (isSameDay(new Date("2024-04-08T18:00:00.000Z"), new Date(weekStartDate))) {
                //     console.log("2024-04-08 23:59:00" + "is the same day as " + weekStartDate)
                // }

                // TODO: remove test (working)
                // if (weekStartDate) {
                //     console.log(weekStartDate)
                // }

                if (fetchedClasses) {
                    // Set the classes state as the classes returned
                    setClasses(fetchedClasses)
                    
                    // Add and set the day field for classes
                    // const updatedClasses = fetchedClasses.map(clazz => {
                    //     let day;
                    //     switch (clazz.weekday) {
                    //         case 0:
                    //             day = "Monday"
                    //             break
                    //         case 1:
                    //             day = "Tuesday"
                    //             break
                    //         case 2:
                    //             day = "Wednesday"
                    //             break
                    //         case 3:
                    //             day = "Thursday"
                    //             break
                    //         case 4:
                    //             day = "Friday"
                    //             break
                    //         case 5:
                    //             day = "Saturday"
                    //             break
                    //         case 6:
                    //             day = "Sunday"
                    //             break
                    //         default:
                    //             day = ""
                    //     }
                    //     return { ...clazz, day }
                    // })
                    // setClasses(updatedClasses)
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
                <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                    <h2 className="text-lg font-bold">Monday</h2>
                    <h3 className="text-md pt-1">{weekStartDate}</h3>
                </div>
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Activity</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map the classes */}
                        {classes
                            .filter(clazz => isSameDay(addHours(new Date(clazz.datetime), -10), new Date(weekStartDate)))
                            // .filter(clazz=>{
                            //     console.log("clazz.datetime:", addHours(new Date(clazz.datetime), -10));
                            //     console.log("weekStartDate:", addHours(weekStartDate, -10));
                            //     console.log("isSameDay:", isSameDay(addHours(new Date(clazz.datetime), -10), new Date(weekStartDate)));
                            // })
                            // .filter(clazz => {
                            //     const clazzDate = format(new Date(clazz.datetime), "yyyy-MM-dd");
                            //     const weekStartDateFormatted = format(new Date(weekStartDate), "yyyy-MM-dd");
                            //     return clazzDate === weekStartDateFormatted;
                            // })
                            .map(clazz => (
                                //<div>{clazz.id} {clazz.activityName} {clazz.datetime}</div>
                                <Day key={clazz.id} clazz={clazz} />
                            ))}
                    </tbody>
                </table>
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