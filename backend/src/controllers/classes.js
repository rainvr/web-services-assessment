import { Router } from "express"
import * as Classes from "../models/classes.js"
import * as Locations from "../models/locations.js"
import * as Activities from "../models/activities.js"
import pkg from 'lodash'
const { isEmpty } = pkg
import auth from "../middleware/auth.js"
import validator from "validator"
import xml2js from "xml2js"
import { addHours } from "date-fns"

const classController = Router()

// Get all classes
classController.get("/", async (req, res) => {
    try {
        const classes = await Classes.getAll()
        
        if (isEmpty(classes)) {
            return res.status(404).json({
                status: 404,
                message: "There were no classes found"
            })
        }
        
        res.status(200).json({
            status: 200,
            message: "All classes are listed",
            classes
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the classes",
            error
        })
    }
})

// Get the classes for the next week
classController.get("/weekly/:locationId/:weekStartDate", async (req, res) => {
    try {
        const locationId = req.params.locationId
        const weekStartDate = req.params.weekStartDate
        const classes = await Classes.getWeek(weekStartDate, locationId)

        if (isEmpty(classes)) {
            return res.status(404).json({
                status: 404,
                message: "There were no classes found"
            })
        }
        
        res.status(200).json({
            status: 200,
            message: "The classes for the week are listed",
            classes
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the weekly classes",
            error
        })
    }
})


// POST /upload
classController.post("/upload", auth(["manager"]), async (req, res) => {
    
    // If the file is missing or incorrect return an error
    if (!req.files || !req.files["xml-file"]) {  
        return res.status(400).json({
            status: 400,
            message: "No file selected"
        })
    }
    
    try {

        // Convert the file data into a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser({explicitArray : false})
        const data = await parser.parseStringPromise(file_text)
        
        // console.log("data:")  // TODO: remove test
        // console.log(data) // TODO: remove test

        let classesData = data["Classes"]["Class"]

        // If the classesData isn't an array, make it an array
        // xml2js parses single elements as objects and multiple as arrays
        // This check is to ensure everything can be treated equally later
        if (!Array.isArray(classesData)) {
            classesData = [classesData]
        }

        // Validate each class' data
        // console.log("classesData:")  // TODO: remove test
        // console.log(classesData) // TODO: remove test

        const validationErrors = classesData.map(classData => {
            // Validate Datetime
            if (!classData.Datetime || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(classData.Datetime)) {
                return "Invalid Datetime format"
            }
            // Validate Location
            if (!classData.Location || !/^[a-zA-Z -]+$/.test(classData.Location)) {
                return "Invalid Location"
            }
            // Validate Activity
            // if (!classData.Activity || !/^[a-zA-Z -]+$/.test(classData.Activity)) {
            //     return "Invalid Activity"
            // }
            // Validate Trainer
            if (!classData.TrainerID || !validator.isInt(classData.TrainerID)) {
                return "Invalid TrainerID"
            }

            return null // No validation errors
        })

        // Check if any validation errors occurred
        const hasErrors = validationErrors.some(error => error !== null)
        if (hasErrors) {
            // If any validation errors occurred, return them
            const errors = validationErrors.filter(error => error !== null)
            return res.status(400).json({
                status: 400,
                message: "Validation errors: " + errors,
                errors
            })
        } 

        // Insert the classes
        // Map over the classes 
        const insertionPromises = classesData.map(classData => {
            // Sanitise activity and location in puts
            const escapedLocation = validator.escape(classData.Location)
            const escapedActivity = validator.escape(classData.Activity)

            // Lookup location and activity asynchronously
            const retrievedLocation = Locations.getByName(escapedLocation) 
            const retrievedActivity = Activities.getByName(escapedActivity)

            // console.log("retrievedLocation: ")  // TODO: remove test
            // console.log(retrievedLocation)  // TODO: remove test
            // console.log("retrievedActivity: ")  // TODO: remove test
            // console.log(retrievedActivity)  // TODO: remove test

            return Promise.all([retrievedLocation, retrievedActivity]).then(([location, activity]) => {
                // console.log("location: ")  // TODO: remove test
                // console.log(location)  // TODO: remove test
                // console.log("activity: ")  // TODO: remove test
                // console.log(activity)  // TODO: remove test
                
                if (location && activity) {
                    // If matching location and activity objects are found, get their IDs
                    const locationId = location[0].id
                    const activityId = activity[0].id

                    // console.log("locationId: " + locationId)  // TODO: remove test
                    // console.log("activityId: " + activityId)  // TODO: remove test

                    const sanitisedDatetime = validator.escape(classData.Datetime)
                    const localDatetime = addHours(new Date(sanitisedDatetime), -10)

                    // Convert XML object into a model object (sanitising remaining inputs)
                    const classModel = Classes.newClass(
                        null, 
                        localDatetime, 
                        locationId,
                        activityId,
                        validator.escape(classData.TrainerID)
                    )

                    // console.log("classModel:")  // TODO: remove test
                    // console.log(classModel) // TODO: remove test

                    // Insert the class 
                    return Classes.create(classModel);
                } else {
                    // If either location or activity is not found, return an error
                    return Promise.reject("Invalid Location or Activity: Only existing locations or activities are acceptable")
                }
            })
        })

        // Wait for all insertion promises to resolve
        await Promise.all(insertionPromises)

        return res.status(200).json({
            status: 200,
            message: "Classes XML Upload insert was successful"
        })
        
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Classes XML Upload failed: " + error.message
        })
    }
})



// ---------- EXPORT ---------- //

export default classController