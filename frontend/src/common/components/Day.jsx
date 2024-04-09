import { useState } from "react"
import Activity from "./Activity"

function Day({clazz}) {

    return ( 
        <>
            <div className="flex flex-col w-full bg-slate-200 py-1 px-4 rounded-box ">
                <h2 className="text-lg font-bold">{clazz.day}</h2>
                <h2 className="text-lg font-bold">{clazz.datetime}</h2>
            </div>
            <table className="table">
                {/* head */}
                <thead>
                    <tr>
                        <th></th>
                        <th>Activity</th>
                        <th>Times</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <Activity name={"Pilates"} times={"3pm"} />
                </tbody>
            </table>
        </>
    )
}

export default Day