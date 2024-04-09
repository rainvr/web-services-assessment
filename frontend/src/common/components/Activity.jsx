

function Activity({name, times}) {
    return (
        <tr className="hover">
            <th></th>
            <td>{name}</td>
            <td>{times}</td>
            <td><button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200">Book</button></td>
      </tr>
    )
}

export default Activity