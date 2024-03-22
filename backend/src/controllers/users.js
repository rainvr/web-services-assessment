import { Router } from "express"
import * as Users from "../models/users.js"

const userController = Router()

// ---------- READ ---------- //

// userController.post("/login", (req, res) => {  // TODO: reinstate this over next line when frontend is ready for login
userController.post("/login", getLogin)

export function getLogin(req, res) {    
    let loginData = req.body

    // TODO: need input validation

    Users.getUserByEmail(loginData.email).then(user => {
        // TODO: need bcrypt compare.Sync (in if then structure)
        res.status(200).json({
            status: 200,
            message: "The user information has been returned!",
            user
        })
    }).catch(error => {
        res.status(400).json({
            status: 400,
            message: "login failed"
        })
    })

}
// )


// Get all users
userController.get("/", async (req, res) => {
    const users = await Users.getAllUsers()

    res.status(200).json({
        status: 200,
        message: "All Users List",
        users
    })
})

// Get the user by their email
userController.get("/profile/:email", async (req, res) => {
    const userEmail = req.params.email
    const user = await Users.getUserByEmail(userEmail)

    res.status(200).json({
        status: 200,
        message: "The user has been returned!",
        user
    })
})

export default userController