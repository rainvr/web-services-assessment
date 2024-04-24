import { Router } from "express"
import * as Users from "../models/users.js"
import pkg from 'lodash'
const { isEmpty } = pkg
import { v4 as uuid4 } from "uuid"
import auth from "../middleware/auth.js"
import validator from "validator"
import xml2js from "xml2js"
import bcrypt from "bcryptjs"

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

        // If a matching user object is not found, return an error
        if (!bcrypt.compareSync(loginData.password, user.password)) {  
            return res.status(400).json({
                status: 400,
                message: "Invalid credentials: loginData: " + loginData.password + " stored pw: " + user.password  // TODO: remove pws from string
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
userController.post("/logout", auth(["manager", "member", "trainer"]), (req, res) => {
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
    if (!/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})$/.test(registerData.password)) {
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

    // Hash the password
    registerData.password = bcrypt.hashSync(registerData.password)

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

// POST /upload
userController.post("/upload", auth(["manager"]), async (req, res) => {
    
    // If the file is missing or incorrect return an error
    if (!req.files || !req.files["xml-file"]) {  
        return res.status(400).json({
            status: 400,
            message: "No file selected"
        })
    }
    
    try {

        // Convert the file data into a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser({explicitArray : false})
        const data = await parser.parseStringPromise(file_text)
        
        let usersData = data["Users"]["User"]

        // If the usersData isn't an array, make it an array
        // xml2js parses single elements as objects and multiple as arrays
        // This check is to ensure everything can be treated equally later
        if (!Array.isArray(usersData)) {
            usersData = [usersData]
        }
        
        // Validate each user's data
        const validationErrors = usersData.map(userData => {
            // Validate email
            if (!userData.Email || !validator.isEmail(userData.Email)) {
                return "Invalid email format"
            }
            // Validate password
            if (!userData.Password || !/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})$/.test(userData.Password)) {
                return "Invalid Password. Must use a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces"
            }
            // Validate role
            if (!userData.Role || !(userData.Role === "member" || userData.Role === "trainer" || userData.Role === "manager")) {
                return "Invalid user role"
            }
            // Validate first name
            if (!userData.FirstName || !/^[a-zA-Z -]+$/.test(userData.FirstName)) {
                return "Invalid first name"
            }
            // Validate last name
            if (!userData.LastName || !/^[a-zA-Z -]+$/.test(userData.LastName)) {
                return "Invalid last name"
            }
            // Turn the phone number into a string if it is null
            if (!userData.Phone) {
                userData.Phone = ""
            }
            // Validate phone number
            if (userData.Phone && !/^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/.test(userData.Phone)) {
                return "Invalid phone number"
            }
            // Turn the address into a string if it is null
            if (!userData.Address) {
                userData.Address = ""
            }
            // Validate address
            if (userData.Address && !/^[a-zA-Z0-9\- ,]+$/.test(userData.Address)) {
                return "Invalid address"
            }
            return null // No validation errors
        })

        // Check if any validation errors occurred
        const hasErrors = validationErrors.some(error => error !== null)

        if (hasErrors) {
            // If any validation errors occurred, return them
            const errors = validationErrors.filter(error => error !== null)
            return res.status(400).json({
                status: 400,
                message: "Validation errors: " + errors,
                errors
            })
        } else {
            // Insert users if all validations pass
            const insertionPromises = usersData.map(userData => {
                // Convert XML object into a model object
                const userModel = Users.newUser(
                    null, 
                    validator.escape(userData.Email), 
                    // Hash the password
                    bcrypt.hashSync(userData.Password),
                    // userData.Password, 
                    validator.escape(userData.Role), 
                    validator.escape(userData.Phone),
                    validator.escape(userData.FirstName),
                    validator.escape(userData.LastName),
                    validator.escape(userData.Address),
                    null
                )

                // Check if a user with that email exists
                return Users.getByEmail(userModel.email).then(user => {
                    if (user) {
                        // If a matching user object is found, skip insertion
                        return null
                    } else {
                        // If no matching user object is found, insert the user
                        return Users.create(userModel)
                    }
                })
            })

            // Wait for all insertion promises to resolve
            await Promise.all(insertionPromises)

            return res.status(200).json({
                status: 200,
                message: "Users XML Upload insert was successful"
            })
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Users XML Upload failed: " + error.message
        })
    }
})


// POST /profile
userController.post("/profile", auth(["manager", "member", "trainer"]), async (req, res) => {
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

        // Check for hashing on the password & validate if not hashed
        if (!updateData.password.startsWith("$2a")) {
            // Validate the password
            if (!/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})$/.test(updateData.password)) {
                // Show error
                return res.status(400).json({
                    status: 400,
                    message: "Invalid Password. Must use a minimum of 6 characters, at least 1 uppercase letter, 1 lowercase letter, and 1 number with no spaces"
                })
            }
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
            // Hash the password
            bcrypt.hashSync(updateData.password),
            // TODO: delete this: updateData.Password,
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
                    response 
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
    try {
        const users = await Users.getAll()

        res.status(200).json({
            status: 200,
            message: "All Users List",
            users
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error getting the users",
            error
        })
    }
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
userController.get("/edit/:userId", auth(["manager", "member", "trainer"]), async (req, res) => {
    
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