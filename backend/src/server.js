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
// Need to use navigate for the profile page
// app.use("/profile", userController)

// TODO: Catch errors raised by endpoints

// Start listening for API requests
app.listen(port, ()=>{
    console.log("server is listening on port http://localhost:"+ port)
})