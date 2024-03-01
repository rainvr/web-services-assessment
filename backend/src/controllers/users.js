import { Router } from "express"
import * as Users from "../models/users.js"

// TODO: need input validation

const userController = Router()

userController.post("/login", (req, res) => {
    let loginData = req.body

    // TODO: need input validation

    Users.getUserByEmail(loginData.email) 
        .then(user => { console.log(user) })
})

userController.get("/", async (req, res) => {
    const users = await Users.getAllUsers()

    res.status(200).json({
        status: 200,
        message: "All Users List",
        users
    })
})

export default userController