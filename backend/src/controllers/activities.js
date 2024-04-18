import { Router } from "express"
import * as Activities from "../models/activities.js"
import pkg from 'lodash'
const { isEmpty } = pkg

const activityController = Router()

// Get the activity by the name
activityController.get("/:activityName", async (req, res) => {
    try {
        const activityName = req.params.activityName
        const activity = await Activities.getByName(activityName)
        
        if (isEmpty(activity)) {
            return res.status(404).json({
                status: 404,
                message: "There was no activity found matching that activity name"
            })
        }
        
        res.status(200).json({
            status: 200,
            message: "The matching activity is listed",
            activity
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the activity from the given activity name",
            error
        })
    }
})

// ---------- EXPORT ---------- //

export default activityController