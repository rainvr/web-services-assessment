// --- The Calendar Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import * as Classes from "../../api/classes"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useAuthentication } from "../authentication"

function ClassesPage() {
    const [user] = useAuthentication()
    const [classes, setClasses] = useState([])
    const [statusMessage, setStatusMessage] = useState("")

    // Fetch the classes (with location, trainer and activity data included)
    async function fetchClasses() {
        try {
            // Get all the classes from the db
            const fetchedClasses = await Classes.getByUserId(user.id, user.authenticationKey)
            
            if (fetchedClasses) {
                // Set the classes state as the classes returned
                setClasses(fetchedClasses)
                
            } else {
                setClasses([])
                console.log("No classes returned")
            }
        } catch (error) {
            console.error("Error fetching classes:", error)
        }
    }

    async function cancel(classId) {
        try {
            const cancelled = await Classes.deleteById(classId, user.authenticationKey)
            if (cancelled) {
                setStatusMessage("Success! " + cancelled.message)
                fetchClasses()
            }
        } catch (error) {
            console.log("Error cancelling the class", error)
        }
    }

    useEffect(() => {
        fetchClasses()
    }, [user])

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-auto">
                <h1 className="text-xl font-bold text-center">Your Classes</h1>
                <div className="divider mt-0 mb-2"></div> 
                {/* ---- NO CLASSES MESSAGE ---- */}
                { classes.length == 0 && <>
                    <p className="text-md font-normal text-center">You have no classes.</p>
                    <p className="text-md font-normal text-center">Please ask a manager to upload a classes xml.</p>
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
                {/* ---- CLASSES LIST ---- */}
                {classes.map(clazz => 
                    <form key={clazz.classId} className="card-body card w-80 sm:w-96 md:w-[500px] lg:w-[650px]  mb-4 bg-base-100 shadow-xl">
                        <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                            <div className="flex flex-row justify-between w-full">
                                {clazz && <h2 className="text-lg font-bold">{clazz.locationName}</h2>}
                                <h2 className="text-lg font-semibold">{format(new Date(clazz.classDatetime), 'EEE do LLL')}</h2>
                            </div>
                        </div>
                        {clazz && <>
                            <p className="pl-4"><strong>Class: </strong>{clazz.activityName}</p>
                            <p className="pl-4"><strong>Time: </strong>{format(new Date(clazz.classDatetime), 'hh:mm bbb')}</p>
                            <p className="pl-4"><strong>Duration: </strong>{clazz.activityDuration} minutes</p>
                            <p className="pl-4"><strong>Enrolled: </strong>{clazz.bookingCount}</p>
                        </> }
                    </form>
                )}
            </section>
            <Footer />
        </main>
    )
}

export default ClassesPage