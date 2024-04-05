import { Router } from "express"
import * as Users from "../models/users.js"
import pkg from 'lodash'
const { isEmpty } = pkg
import { v4 as uuid4 } from "uuid"
import auth from "../middleware/auth.js"
import validator from "validator"

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

        // Validate email
        if (!validator.isEmail(loginData.email)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid email format"
            })
        }

        // Get the user from the db by their email
        const user = await Users.getByEmail(loginData.email)

        // If no matching user object is found
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "The user was not found"
            })
        }

        // TODO: Convert password to hash
        // loginData.password = bcrypt.hashSync(loginData.password)

        // TODO: If a matching user object is found, check if the pw hashes match
        // if (bcrypt.compareSync(loginData.password, user.password)) {  
        //     return res.status(400).json({
        //         status: 400,
        //         message: "Invalid credentials"
        //     })
        // }
        
        // If a matching user object is found check the passwords match
        if (loginData.password != user.password) {  
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

    // Check if there is an Authentication Key
    if (isEmpty(authenticationKey)) {  // If the request body is empty
        return res.status(400).json({
            status: 400,
            message: "Missing Authentication Key"
        })
    } 

    // Validate the Authentication Key
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(authenticationKey)) {
        // Show error
        return res.status(400).json({
            status: 400,
            message: "Invalid Authentication Key format"
        })
    }

    // Get the user by the Authentication Key
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

    // --- VALIDATION --- //

    // Validate email
    if (!validator.isEmail(registerData.email)) {
        // Show error
        return res.status(400).json({
            status: 400,
            message: "Invalid email format"
        })
    }

    // Validate the password
    if (!/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(registerData.password)) {
        // Show error
        return res.status(400).json({
            status: 400,
            message: "Invalid Password. Must use a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces"
        })
    }

    // Validate firstname
    if (!/^[a-zA-Z -]+$/.test(registerData.firstname)) {
        // Show error
        return res.status(400).json({
            status: 400,
            message: "Invalid first name"
        })
    }

    // Validate lastname
    if (!/^[a-zA-Z -]+$/.test(registerData.lastname)) {
        // Show error
        return res.status(400).json({
            status: 400,
            message: "Invalid last name"
        })
    }

    // Validate phone number
    if (!/^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(registerData.phone)) {
        // Show error
        return res.status(400).json({
            status: 400,
            message: "Invalid phone number"
        })
    }

    // Validate Address
    if (!/^[a-zA-Z0-9\- ,]+$/.test(registerData.address)) {
        // Show error
        return res.status(400).json({
            status: 400,
            message: "Invalid address"
        })
    }

    // TODO: Hash the password
    // registerData.password = bcrypt.hashSync(registerData.password);

    // Convert the user data into an User model object (and sanitise appropriate inputs)
    const userObject = Users.newUser(
        null,
        validator.escape(registerData.email),
        registerData.password,
        "member",
        validator.escape(registerData.phone),
        validator.escape(registerData.firstname),
        validator.escape(registerData.lastname),
        validator.escape(registerData.address),
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
        
        // Validate the Authentication Key
        if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(authenticationKey)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid Authentication Key format"
            })
        }

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

// PATCH /update
userController.patch("/update", auth(["manager", "member", "trainer"]), async (req, res) => {
    try {
    
        // Get the authentication key from the header
        const updateData = req.body

        // If no request body is found
        if (isEmpty(updateData)) {
            return res.status(404).json({
                status: 400,
                message: "Missing request body"
            })
        }
        
        // --- VALIDATION --- //

        // Validate email
        if (!validator.isEmail(updateData.email)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid email format"
            })
        }

        // Validate the password
        if (!/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/.test(updateData.password)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid Password. Must use a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces"
            })
        }

        // Validate firstname
        if (!/^[a-zA-Z -]+$/.test(updateData.firstname)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid first name"
            })
        }

        // Validate lastname
        if (!/^[a-zA-Z -]+$/.test(updateData.lastname)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid last name"
            })
        }

        // Validate phone number
        if (!/^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(updateData.phone)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid phone number"
            })
        }

        // Validate Address
        if (!/^[a-zA-Z0-9\- ,]+$/.test(updateData.address)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid address"
            })
        }

        // Convert the update data into an User model object (sanitise appropriate inputs)
        const userObject = Users.newUser(
            updateData.id,
            validator.escape(updateData.email),
            updateData.password,  // TODO: bcrypt the password when inputting
            updateData.role,
            validator.escape(updateData.phone),
            validator.escape(updateData.firstname),
            validator.escape(updateData.lastname),
            validator.escape(updateData.address),
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

        // Validate the Authentication Key
        if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(authenticationKey)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid Authentication Key format"
            })
        }

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

// Get user by Id
userController.get("/edit/:userId", async (req, res) => {
    
    const userId = req.params.userId
    
    try {
        
        // If no userId param
        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "Missing User ID"
            })
        }

        // Validate the userId
        if (!/^(0|[1-9]\d*)$/.test(userId)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid userId format"
            })
        }

        const user = await Users.getById(userId)
        
        return res.status(200).json({
            status: 200,
            message: "Retrieved the user by their ID",
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

// ---------- DELETE ---------- //

// DELETE /
userController.delete("/:id", auth(["manager"]), async (req, res) => {
    try {
        // Get the id
        const userId = req.params.id

        // If no param is found
        if (isEmpty(userId)) {
            return res.status(404).json({
                status: 400,
                message: "Missing ID in the request"
            })
        }

        // Validate the userId
        if (!/^(0|[1-9]\d*)$/.test(userId)) {
            // Show error
            return res.status(400).json({
                status: 400,
                message: "Invalid userId format"
            })
        }

        // Delete the user object in the db with matching ID
        const response = await Users.deleteById(userId)
        
        .then(response => {
                res.status(200).json({
                    status: 200,
                    message: "User Deleted"
                })
            })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Delete failed",
            error
        })
    }
})


// ---------- EXPORT ---------- //

export default userController