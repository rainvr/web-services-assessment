import { format } from "date-fns"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthentication } from "../authentication"


function Activity({clazz}) {
    const navigate = useNavigate()
    const [user] = useAuthentication()

    return (
        <tr className="hover w-full">
            <th></th>
            <td>{clazz.activityName}</td>
            <td>{clazz.activityDuration} minutes</td>
            { user && user.role === "member" && <td><button type="submit" onClick={() => navigate(`/create-booking`, {state: {clazz}})} className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200">Book</button></td> }
      </tr>
    )
}

export default Activity