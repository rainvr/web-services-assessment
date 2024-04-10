import { format } from "date-fns"

function Activity({name, time}) {
    const formattedTime = format(new Date(time), 'hh:mm bbb')
    return (
        <tr className="hover">
            <th></th>
            <td>{name}</td>
            {/* <td>{format(Date({time}), "h 'o''clock'")}</td> */}
            <td>{formattedTime}</td>
            <td><button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200">Book</button></td>
      </tr>
    )
}

export default Activity