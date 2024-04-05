import { Router } from "express"
import * as Blogs from "../models/blogs.js"
import pkg from 'lodash'
const { isEmpty } = pkg
import { v4 as uuid4 } from "uuid"
import auth from "../middleware/auth.js"
import validator from "validator"

const blogController = Router()

// Get all blogs
blogController.get("/", async (req, res) => {
    try {
        const blogs = await Blogs.getAll()
        
        if (isEmpty(blogs)) {
            return res.status(404).json({
                status: 404,
                message: "There were no blogs found"
            })
        }
        
        res.status(200).json({
            status: 200,
            message: "All blogs are listed",
            blogs
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the blogs",
            error
        })
    }
})

// ---------- EXPORT ---------- //

export default blogController