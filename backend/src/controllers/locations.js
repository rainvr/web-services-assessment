import { Router } from "express"
import * as Locations from "../models/locations.js"
import pkg from 'lodash'
const { isEmpty } = pkg

const locationController = Router()

// Get all locations
locationController.get("/", async (req, res) => {
    try {
        const locations = await Locations.getAll()
        
        if (isEmpty(locations)) {
            return res.status(404).json({
                status: 404,
                message: "There were no locations found"
            })
        }
        
        res.status(200).json({
            status: 200,
            message: "All locations are listed",
            locations
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the locations",
            error
        })
    }
})

// ---------- EXPORT ---------- //

export default locationController