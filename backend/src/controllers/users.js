import { Router } from "express"
import * as Users from "../models/users.js"
import pkg from 'lodash'
const { isEmpty } = pkg
import { v4 as uuid4 } from "uuid"

const userController = Router()

// ---------- READ ---------- //

// POST /login
userController.post("/login", async (req, res) => {  
    let loginData = req.body
    try {
        if (isEmpty(loginData)) {  // If the request body is empty
            return res.status(400).json({
                status: 400,
                message: "Missing request body"
            })
        } 

        // TODO: Validate request body
        const user = await Users.getByEmail(loginData.email)
        // If no matching user object is found
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "The user was not found"
            })
        }

        // If a matching user object is found check the passwords match
        if (loginData.password != user.password) {  // TODO: bcrypt hashsync this
            return res.status(400).json({
                status: 400,
                message: "Invalid credentials"
            })
        }
        
        // create a unique auth key
        user.authKey = uuid4().toString()  

        // console.log("user" + JSON.stringify(user, null, 2)) // TODO: remove this test

        Users.updateById(user).then(result => {
            res.status(200).json({
                status: 200,
                message: "The user is logged in",
                authenticationKey: user.authKey,
            })
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "login failed",
            error
        })
    } 
})

// GET /Logout
userController.post("/logout", (req, res) => {
    // Get the authentication key from the header
    const authKey = req.get("X-AUTH-KEY")

    // TODO: validate auth key header (not empty and in the appropriate uuid style)

    Users.getByAuthKey(authKey).then(user => {
        
        // If no matching user object is found
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "The user was not found"
            })
        }

        // Clear the authKey from the returned user object
        user.authKey = null  

        // Update the user object in the db with the cleared authKey
        Users.updateById(user).then(response => {
            res.status(200).json({
                status: 200,
                message: "User is logged out",
                response  // TODO: do I really want to return the full user object here?
            })
        })
    }).catch(error => {
        res.status(400).json({
            status: 400,
            message: "logout failed",
            error
        })
    })
})


// Get all users
userController.get("/", async (req, res) => {
    const users = await Users.getAll()

    res.status(200).json({
        status: 200,
        message: "All Users List",
        users
    })
})

// Get the user by their email
userController.get("/profile/:email", async (req, res) => {
    const userEmail = req.params.email
    const user = await Users.getByEmail(userEmail)

    res.status(200).json({
        status: 200,
        message: "The user has been returned!",
        user
    })
})


// ---------- CREATE ---------- //

// POST /register
userController.post("/register", (req, res) => {
    let registerData = req.body 
    
    if (isEmpty(registerData)) {  // If the request body is empty
        res.status(400).json({
            status: 400,
            message: "Missing request body"
        })
    } else {  // If there is a request body

        // TODO: Validate request body

        // Convert the user data into an User model object
        const userObject = Users.newUser(
            null,
            registerData.email,
            registerData.password,  // TODO: bcrypt the password when inputting
            registerData.role,
            registerData.phone,
            registerData.firstname,
            registerData.lastname,
            registerData.address,
            null
        )

        // Check if a user with that email exists
        Users.getByEmail(userObject.email).then(user => {
            
            if (user) {  // If a matching user object is found
            res.status(400).json({
                status: 400,
                message: "A user with this email alread exists",
                user
                })
            } else {  // If no matching user object is found
                Users.create(userObject).then(user => {
                    res.status(200).json({
                        status: 200,
                        message: "User has been registered",
                        user: user
                    })
                })
            }
        }).catch(error => {
            res.status(400).json({
                status: 400,
                message: "Registration failed"
            })
        })
    }
})

export default userController