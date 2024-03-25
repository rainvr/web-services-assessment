import { Router } from "express"
import * as Users from "../models/users.js"
import pkg from 'lodash'
const { isEmpty } = pkg

const userController = Router()

// ---------- READ ---------- //

// userController.post("/login", (req, res) => {  // TODO: reinstate this over next line when frontend is ready for login
userController.post("/login", getLogin)

export function getLogin(req, res) {    
    let loginData = req.body

    if (isEmpty(loginData)) {  // If the request body is empty
        res.status(400).json({
            status: 400,
            message: "Missing request body"
        })
    } else {  // If there is a request body

        Users.getByEmail(loginData.email).then(user => {

            // TODO: need bcrypt compare.Sync (in if then structure)
            // TODO: compare passwords
            
            if (user) {  // If a matching user object is found
            res.status(200).json({
                status: 200,
                message: "The user information has been returned",
                user
                })
            } else {  // If no matching user object is found
                res.status(404).json({
                    status: 404,
                    message: "The user was not found"
                })
            }
        }).catch(error => {
            res.status(400).json({
                status: 400,
                message: "login failed"
            })
        })
    } 
}
// )


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

userController.post("/register", (req, res) => {
    let registerData = req.body 
    
    if (isEmpty(registerData)) {  // If the request body is empty
        res.status(400).json({
            status: 400,
            message: "Missing request body"
        })
    } else {  // If there is a request body

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