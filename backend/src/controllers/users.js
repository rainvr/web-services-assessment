import { Router } from "express"
import * as Users from "../models/users.js"
import pkg from 'lodash'
const { isEmpty } = pkg
import { v4 as uuid4 } from "uuid"
import auth from "../middleware/auth.js"

const userController = Router()

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

        // Get the user from the db by their email
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
        
        // Create a unique auth key for the returned user
        user.authenticationKey = uuid4().toString()  

        // Update the user in the db with the one with the new authenticationKey
        Users.updateById(user).then(result => {
            res.status(200).json({
                status: 200,
                message: "The user is logged in",
                authenticationKey: user.authenticationKey,
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

// POST /Logout
userController.post("/logout", (req, res) => {
    // Get the authentication key from the header
    const authenticationKey = req.get("X-AUTH-KEY")

    // TODO: validate auth key header (not empty and in the appropriate uuid style)

    Users.getByauthenticationKey(authenticationKey).then(user => {
        
        // If no matching user object is found
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "The user was not found"
            })
        }

        // Clear the authenticationKey from the returned user object
        user.authenticationKey = null  

        // Update the user object in the db with the cleared authenticationKey
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

// POST /register
userController.post("/register", (req, res) => {
    const registerData = req.body 
    
    // If the request body is empty return an error
    if (isEmpty(registerData)) {  
        return res.status(400).json({
            status: 400,
            message: "Missing request body"
        })
    }

    // TODO: Validate request body

    // Convert the user data into an User model object
    const userObject = Users.newUser(
        null,
        registerData.email,
        registerData.password,  // TODO: bcrypt the password when inputting
        "member",
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
            message: "A user with this email already exists",
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
            message: "Registration failed",
            error
        })
    })
})

// POST /profile
userController.post("/profile", async (req, res) => {
    const authenticationKey = req.get("X-AUTH-KEY")

    try {
        // If no X-AUTH-KEY in the header
        if (!authenticationKey) {
            return res.status(400).json({
                status: 400,
                message: "Missing Authentication Key"
            })
        }
        
        // TODO: Validate authenticationKey

        const user = await Users.getByauthenticationKey(authenticationKey)
        
        // If no matching user object is found
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "The user was not found"
            })
        }
        
        return res.status(200).json({
            status: 200,
            message: "The user profile has been returned",
            user
        })
    } catch (error) {
      res.status(500).json({
        status: 500,
        message: "Error getting the user profile",
        error
      })
    }
})

// POST /update
userController.post("/update", async (req, res) => {
    try {
    
        // Get the authentication key from the header
        const updateData = req.body
        console.log(updateData)

        // If no request body is found
        if (isEmpty(updateData)) {
            return res.status(404).json({
                status: 400,
                message: "Missing request body"
            })
        }

        // TODO: Validate request body

        // Convert the update data into an User model object
        const userObject = Users.newUser(
        updateData.id,
        updateData.email,
        updateData.password,  // TODO: bcrypt the password when inputting
        updateData.role,
        updateData.phone,
        updateData.firstname,
        updateData.lastname,
        updateData.address,
        updateData.authenticationKey
    )

        // Update the user object in the db with the form data
        const response = await Users.updateById(userObject)
        
        .then(response => {
                res.status(200).json({
                    status: 200,
                    message: "Updated",
                    response  // TODO: do I want to return the full user object here?
                })
            })
    } catch (error) {
        res.status(400).json({
            status: 400,
            message: "Update failed",
            error
        })
    }
})


// Get all users
userController.get("/", auth(["manager"]), async (req, res) => {
    const users = await Users.getAll()

    res.status(200).json({
        status: 200,
        message: "All Users List",
        users
    })
})

// Get user by Auth Key
userController.get("/authentication/:authenticationKey", async (req, res) => {
    
    const authenticationKey = req.params.authenticationKey
    
    try {
        
        // If no X-AUTH-KEY in the header
        if (!authenticationKey) {
            return res.status(400).json({
                status: 400,
                message: "Missing Authentication Key"
            })
        }

        // TODO: Validate authenticationKey

        const user = await Users.getByauthenticationKey(authenticationKey)
        
        return res.status(200).json({
            status: 200,
            message: "Retrieved the user by the Authentication Key",
            user
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the user",
            error
        })
    }
})


// ---- PRACTICE CONTROLLERS ---- //
// TODO: remove practice controllers?

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

export default userController