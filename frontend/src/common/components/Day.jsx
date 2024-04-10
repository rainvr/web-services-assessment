import { useState } from "react"
import Activity from "./Activity"

function Day({clazz}) {

    return ( 
        <>
            {/* <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                <h2 className="text-lg font-bold">{clazz.day}</h2>
                <h3 className="text-md pt-1">{clazz.date}</h3>
            </div> */}
            
                    <Activity name={clazz.activityName} time={clazz.datetime} />
                
        </>
    )
}

export default Day