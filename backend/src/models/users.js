import { db } from "../database.js";

// Construct a new user object
export function newUser(id, email, password, role, phone, firstname, lastname, address) {
    return {
        id,
        email,
        password,
        role, 
        phone,
        firstname,
        lastname,
        address
    }
}

// Get all the users from the database
export function getAllUsers() {
    return db.query("SELECT * FROM users")
        .then((([queryResult]) => {
            return queryResult.map(
                result => newUser(
                    result.user_id,
                    result.user_email,
                    result.user_password,
                    result.user_role,    
                    result.user_phone,
                    result.user_firstname,
                    result.user_lastname,
                    result.user_address
                )
            )
        }))
}

// Get a user by their ID
export function getUserById(userId) {
    return db.query("SELECT * FROM users WHERE user_id = ?", userId)
        .then((([queryResult]) => {
            if (queryResult.length > 0) {
                return queryResult.map(
                    result => newUser(
                        result.user_id,
                        result.user_email,
                        result.user_password,
                        result.user_role,    
                        result.user_phone,
                        result.user_firstname,
                        result.user_lastname,
                        result.user_address
                    )
                )
            } else {
                console.log(`Error - No users with user_id: ${userId}`)
                // return
            }
        }))
        .catch(error => {
            console.log(`Error getting the user: ${error}`)
        })
}

// getUserById(2).then(result => {
//     return console.log(result)
// })

// Get a user by their email
export async function getUserByEmail(userEmail) {
    try {
        const [queryResult] = await db.query("SELECT * FROM users WHERE user_email = ?", userEmail)
        if (queryResult.length > 0) {
            return queryResult.map(
                result => newUser(
                    result.user_id,
                    result.user_email,
                    result.user_password,
                    result.user_role,    
                    result.user_phone,
                    result.user_firstname,
                    result.user_lastname,
                    result.user_address
                )
            )
        } else {
            return console.log(`Error - No users with user_email: ${userEmail}`)
        }
    } catch {
        (error) => {
            console.log(`Error getting the user: ${error}`)
        }
    }
}

// getUserByEmail("manager@email.com").then(result => {
//     return console.log(result)
// })