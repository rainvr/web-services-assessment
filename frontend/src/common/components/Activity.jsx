import { format } from "date-fns"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


function Activity({clazz}) {
    const navigate = useNavigate()
    
    const formattedTime = format(new Date(clazz.datetime), 'hh:mm bbb')
    // const [clazz, setClazz] = useState(clazz)

    return (
        <tr className="hover">
            <th></th>
            <td>{clazz.activityName}</td>
            {/* <td>{format(Date({time}), "h 'o''clock'")}</td> */}
            <td>{formattedTime}</td>
            {/* <td><button type="submit"  className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200">Book</button></td>  */}
            <td><button type="submit" onClick={() => navigate(`/create-booking`, {state: {clazz}})} className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200">Book</button></td> 
      </tr>
    )
}

export default Activity