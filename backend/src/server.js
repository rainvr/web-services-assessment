import express from "express"
import cors from "cors"
import userController from "./controllers/users.js"

const app = express()
const port = 8080

// Enable Cross Origin Resource Sharing
app.use(cors({
    // Allow all origins
    origin: true,
}))

// Enable JSON request parsing middleware
app.use(express.json())

// Import and use routes defined by the controllers
app.use("/users", userController)

// Catch errors raised by endpoints and respond with JSON error object
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status,
        message: err.message,
        errors: err.errors,
    })
})

// Start listening for API requests
app.listen(port, ()=>{
    console.log("server is listening on port http://localhost:"+ port)
})