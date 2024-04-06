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

// ---------- CREATE ---------- //

// POST /create
blogController.post("/", auth(["manager", "trainer", "member"]), async (req, res) => {
    try {
        const createData = req.body
        
        // If the request body is empty return an error
        if (isEmpty(createData)) {  
            return res.status(400).json({
                status: 400,
                message: "Missing request body"
            })
        }

        // --- VALIDATION --- //

        // Validate title
        if (!/^[a-zA-Z0-9\- ']{0,250}$/.test(createData.title)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid title"
            })
        }

        // Validate content
        if (!/^[a-zA-Z0-9\- ',.]{0,250}$/.test(createData.content)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid content"
            })
        }

        // Convert the blog data into an blog model object (and sanitise appropriate inputs)
        const blogObject = Blogs.newBlog(
            null,
            createData.userId,
            null,
            createData.datetime,
            validator.escape(createData.title),
            validator.escape(createData.content)
        )
        const blog = await Blogs.create(blogObject) 
            res.status(200).json({
                status: 200,
                message: "The blog has been created",
                blog
            })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Blog creation failed",
            error
        })
    }
})


// ---------- EXPORT ---------- //

export default blogController