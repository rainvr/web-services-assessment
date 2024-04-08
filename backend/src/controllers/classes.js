import { Router } from "express"
import * as Classes from "../models/classes.js"
import pkg from 'lodash'
const { isEmpty } = pkg
import auth from "../middleware/auth.js"
import validator from "validator"

const classController = Router()

// Get all blogs
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




// ---------- EXPORT ---------- //

export default classController