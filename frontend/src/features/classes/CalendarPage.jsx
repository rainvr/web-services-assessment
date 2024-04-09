// --- The Calendar Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Classes from "../../api/classes"
import { useEffect, useState } from "react"
import Week from "../../common/components/Week"

function CalendarPage() {
    const [classes, setClasses] = useState([])
    const [locations, setLocations] = useState([])
    const [day, setDay] = useState()

    // Fetch all classes function
    // async function fetchClasses() {
    //     try {
    //         const fetchedClasses = await Classes.getAll()
    //         if (fetchedClasses) {  // If we have some classes returned
    //             setClasses(fetchedClasses)  // Set the classes state as the classes returned
    //             return classes
    //         } else {
    //             console.log("No classes returned")  
    //         }
    //     } catch (error) {
    //         console.error("Error fetching classes:", error) 
    //     }
    // }

    // // Function to set the day field for classes
    // function setDayForClasses() {
    //     const updatedClasses = classes.map(clazz => {
    //         let day;
    //         switch (clazz.weekday) {
    //             case 0:
    //                 day = "Monday";
    //                 break;
    //             case 1:
    //                 day = "Tuesday";
    //                 break;
    //             case 2:
    //                 day = "Wednesday";
    //                 break;
    //             case 3:
    //                 day = "Thursday";
    //                 break;
    //             case 4:
    //                 day = "Friday";
    //                 break;
    //             case 5:
    //                 day = "Saturday";
    //                 break;
    //             case 6:
    //                 day = "Sunday";
    //                 break;
    //             default:
    //                 day = "";
    //         }
    //         return { ...clazz, day };
    //     });
    //     setClasses(updatedClasses);
    // }

    // Fetch the classes (with location, trainer and activity data included) AND add the day field
    useEffect(() => {
        async function fetchClassesWithDay() {
            try {
                const fetchedClasses = await Classes.getAll()
                if (fetchedClasses) {
                    // Set the classes state as the classes returned
                    setClasses(fetchedClasses)
                    
                    // Add and set the day field for classes
                    const updatedClasses = fetchedClasses.map(clazz => {
                        let day;
                        switch (clazz.weekday) {
                            case 0:
                                day = "Monday"
                                break
                            case 1:
                                day = "Tuesday"
                                break
                            case 2:
                                day = "Wednesday"
                                break
                            case 3:
                                day = "Thursday"
                                break
                            case 4:
                                day = "Friday"
                                break
                            case 5:
                                day = "Saturday"
                                break
                            case 6:
                                day = "Sunday"
                                break
                            default:
                                day = ""
                        }
                        return { ...clazz, day }
                    })
                    setClasses(updatedClasses)
                } else {
                    console.log("No classes returned")
                }
            } catch (error) {
                console.error("Error fetching classes:", error)
            }
        }
        fetchClassesWithDay()
    }, [])

    // Set the locations list for the classes that exist
    useEffect(() => {
        if (classes.length > 0) {
            const uniqueLocationsMap = new Map(classes.map(clazz => [clazz.locationId, clazz.locationName]))
            const uniqueLocations = Array.from(uniqueLocationsMap, ([locationId, locationName]) => ({ id: locationId, name: locationName }))
            setLocations(uniqueLocations)
            
        }
    }, [classes])
    

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
                            <li key={location.id}><a>{location.name}</a></li>
                        ))}
                    </ul>
                </div>
                {/* Map the weeks */}
                { classes.map(clazz => (
                    <Week clazz={clazz}/>
                ))}
            </section>
            <Footer />
        </main>
    )
}

export default CalendarPage