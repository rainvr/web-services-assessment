import { useState } from "react"
import Activity from "./Activity"
import { format, isSameDay, addHours } from "date-fns"

function Day({classes, day, date}) {

    // Format the date into an exeptable format
    const formattedDate = format(new Date(date), 'do MMMM')

    return ( 
        <>
                <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                    <h2 className="text-lg font-bold">{day}</h2>
                    <h3 className="text-md pt-1">{formattedDate}</h3>
                </div>
                { classes.filter(clazz => isSameDay(addHours(new Date(clazz.datetime), -10), new Date(date))).length > 0 ?
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
                            .filter(clazz => isSameDay(addHours(new Date(clazz.datetime), -10), new Date(date)))
                            .map(clazz => (
                                <Activity key={clazz.id} name={clazz.activityName} time={clazz.datetime} />
                                ))}
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