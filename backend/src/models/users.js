import { db } from "../database.js";

// ---------- CONSTRUCTOR --------- //

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


// ---------- CREATE --------- //

// Create a new user in the database
export async function createUser(user) {
    delete user.id
    return db.query("INSERT INTO users (user_email, user_password, user_phone, user_role, user_firstname, user_lastname, user_address) " + "VALUE (?, ?, ?, ?, ?, ?, ?)",
        [
            user.email,
            user.password,
            user.phone,
            user.role,
            user.firstname,
            user.lastname,
            user.address
        ]).then(([result]) => {
            return { ...user, id: result.insertId }
        })
}

// TODO: remove testing area
// ---- TESTING OK ---- //
// createUser(
//         {
//             id: 34,
//             email: "test2@email.com",
//             password: "123",
//             phone: "0457427772",
//             role: "manager",
//             firstname: "Richard",
//             lastname: "Anderton",
//             address: "15 Goldieslie Rd, Indooroopilly, QLD, Australia"
//         }
//     )
// ---- END TESTING ----//

// ---------- READ --------- //

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

// Get a user by their email (used for login purposes)
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


// ---------- UPDATE --------- //

// Update a user in the database by their ID
export async function updateUser(user) {
    return db.query(
        "UPDATE users SET "
        + "user_email = ?, "
        + "user_password = ?, "
        + "user_phone = ?, "
        + "user_role = ?, "
        + "user_firstname = ?, "
        + "user_lastname = ?, "
        + "user_address = ? "
        + "WHERE user_id = ?",
        [
            user.email,
            user.password,
            user.phone,
            user.role,
            user.firstname,
            user.lastname,
            user.address,
            user.id
        ]
    ).then(([result]) => {
        return { ...user, id: result.insertId}
    })
}
// TODO: remove testing area
// ---- TESTING OK ---- //
// updateUser(
//         {
//             id: 7,
//             email: "bob@email.com",
//             password: "123",
//             phone: "0457427772",
//             role: "trainer",
//             firstname: "Bob",
//             lastname: "Liu",
//             address: "15 Goldieslie Rd, Indooroopilly, QLD, Australia"
//         }
//     )
// ---- END TESTING ----//

// ---------- DELETE --------- //

// Delete a user from the database by the user's ID
export async function deleteUserById(userId) {
    return db.query("DELETE FROM users WHERE user_id = ?", userId)
}
// TODO: remove testing area
// ---- TESTING OK ---- //
// deleteUserById(5)
// ---- END TESTING ----//