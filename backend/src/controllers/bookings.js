import { Router } from "express"
import * as Bookings from "../models/bookings.js"
import pkg from 'lodash'
import validator from "validator"
import auth from "../middleware/auth.js"
const { isEmpty } = pkg

const bookingController = Router()


// GET /:userId
// Get the bookings by the userId
bookingController.get("/:userId", auth(["member"]), async (req, res) => {
    try {
        const userId = req.params.userId
        const bookings = await Bookings.getAll(userId)

        if (isEmpty(bookings)) {
            return res.status(404).json({
                status: 404,
                message: "There were no bookings found"
            })
        }
        
        res.status(200).json({
            status: 200,
            message: "The bookings for the user are returned",
            bookings
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the bookings for the user",
            error
        })
    }
})


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

        // Check if there is already a conflicting booking
        const matchingBooking = await Bookings.getByUserClass(bookingData.userId, bookingData.classId)

        if (matchingBooking) {
            return res.status(400).json({
                status: 400,
                message: "A matching booking has already been made"
            })
        }

        // Convert the booking data into an booking model object (and sanitise appropriate inputs)
        const bookingObject = Bookings.newBooking(
            null,
            bookingData.createDate,
            bookingData.userId,
            bookingData.classId,
            null,
            null,
            null,
            null,
            null,
            null
        )

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


// DELETE /
bookingController.delete("/:id", auth(["member"]), async (req, res) => {
    try {
        // Get the id
        const bookingId = req.params.id

        // If no param is found
        if (isEmpty(bookingId)) {
            return res.status(404).json({
                status: 400,
                message: "Missing ID in the request"
            })
        }

        // Validate the bookingId
        if (!/^(0|[1-9]\d*)$/.test(bookingId)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid booking ID format"
            })
        }

        // Delete the booking object in the db with matching ID
        const response = await Bookings.deleteById(bookingId)
        
        .then(response => {
                res.status(200).json({
                    status: 200,
                    message: "Booking Deleted"
                })
            })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Delete failed",
            error
        })
    }
})


// ---------- EXPORT ---------- //

export default bookingController