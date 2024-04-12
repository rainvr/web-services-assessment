import { Router } from "express"
import * as Bookings from "../models/bookings.js"
import pkg from 'lodash'
import validator from "validator"
import auth from "../middleware/auth.js"
const { isEmpty } = pkg

const bookingController = Router()


// POST /
// Create the booking
bookingController.post("/", auth(["member"]), async (req, res) => {
    try {
    
        const bookingData = req.body 

        // If the request body is empty return an error
        if (isEmpty(bookingData)) {  
            return res.status(400).json({
                status: 400,
                message: "Missing request body"
            })
        }

        // --- VALIDATION --- //

        // TODO: do I validate these integers?  The below causes an error: Type error - expect a string but receive a number
        // Validate the userId
        // if (!validator.isInt(bookingData.userId)) {
        //     // Show error
        //     return res.status(400).json({
        //         status: 400,
        //         message: "Invalid user ID"
        //     })
        // }

        // TODO: do I validate these integers?  The below causes an error: Type error - expect a string but receive a number
        // Validate the classId
        // if (!validator.isInt(bookingData.classId)) {
        //     // Show error
        //     return res.status(400).json({
        //         status: 400,
        //         message: "Invalid class ID"
        //     })
        // }

        // TODO: The below throws the "Invalid creation date error"
        // Validate the createDate
        // if (!validator.isDate(bookingData.createDate)) {
        //     // Show error
        //     return res.status(400).json({
        //         status: 400,
        //         message: "Invalid creation date"
        //     })
        // }

        // TODO: if fix integer validation above, might have to reinstate these couple below to convert back to int
        // Convert the booking data into an booking model object (and sanitise appropriate inputs)
        const bookingObject = Bookings.newBooking(
            null,
            // validator.toInt(bookingData.userId).toString(),
            // validator.toInt(bookingData.classId).toString(),
            bookingData.userId,
            bookingData.classId,
            bookingData.createDate
        )

        console.log(bookingObject) // TODO: remove test

        const booking = await Bookings.create(bookingObject)
            res.status(200).json({
                status: 200,
                message: "The booking has been created",
                booking
            })

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Booking failed: " + error,
            error
        })
    }
})


// ---------- EXPORT ---------- //

export default bookingController