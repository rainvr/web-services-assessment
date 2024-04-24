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

// Get the location by the name
locationController.get("/:locationName", async (req, res) => {
    try {
        const locationName = req.params.locationName
        
        // Validate locationName
        if (!/^[a-zA-Z -]+$/.test(locationName)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid location name"
            })
        }
        
        const location = await Locations.getByName(locationName)
        
        if (isEmpty(location)) {
            return res.status(404).json({
                status: 404,
                message: "There was no location found matching that location name"
            })
        }
        
        res.status(200).json({
            status: 200,
            message: "The matching location is listed",
            location
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the location from the given location name",
            error
        })
    }
})

// ---------- EXPORT ---------- //

export default locationController