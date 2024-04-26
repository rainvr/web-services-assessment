import { useEffect, useState } from "react"
import Activity from "./Activity"
import { format, isSameDay, addHours } from "date-fns"

function Day({classes, day, date}) {

    // Format the date into an exeptable format
    const formattedDate = format(new Date(date), 'do MMMM')

    useEffect(()=> {
        // On page load check the filter works 
        const checkedFilter = classes.filter(clazz => isSameDay(addHours(new Date(clazz.date), -10), new Date(date)))
    }, [])

    return ( 
        <>
                <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                    <h2 className="text-lg font-bold">{day}</h2>
                    <h3 className="text-md pt-1">{formattedDate}</h3>
                </div>
                { classes.filter(clazz => isSameDay(addHours(new Date(clazz.date), -10), new Date(date))).length > 0 ?
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Activity</th>
                            <th>Duration</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map the classes */}
                        {classes
                            .filter(clazz => isSameDay(addHours(new Date(clazz.date), -10), new Date(date)))
                            .map(clazz => (
                                <Activity key={`${clazz.date}-${clazz.activityId}`} clazz={clazz} />
                            ))
                        }
                    </tbody>
                </table>
                : 
                <div>
                    <p className="text-sm pl-8">No classes available</p> 
                </div>}

        </>
    )
}

export default Day