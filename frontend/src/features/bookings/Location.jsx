import Activity from "../classes/Activity"
import { isSameDay, addHours } from "date-fns"

function Location({bookings}) {

    return ( 
        <>
                { bookings.filter(booking => isSameDay(addHours(new Date(clazz.datetime), -10), new Date(date))).length > 0 ?
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
                                <Activity key={clazz.id} clazz={clazz} />
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

export default Location