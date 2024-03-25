import { db } from "../database.js";

// --------- CONSTRUCTOR ---------- //

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

// --------- READ ---------- //

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
            const userResult = queryResult[0]
            // console.log(userResult)  // TODO: remove test
            return Promise.resolve(
                newUser(
                    userResult.user_id.toString(),
                    userResult.user_email,
                    userResult.user_password,
                    userResult.user_role,    
                    userResult.user_phone,
                    userResult.user_firstname,
                    userResult.user_lastname,
                    userResult.user_address
                )
            )
        } else {
            return Promise.resolve(null)
            // return Promise.reject("No user found")
            // console.log(`Error - No users with user_email: ${userEmail}`)
        }
    } catch {
        return Promise.reject("Error getting the user")
        // (error) => {
        //     console.log(`Error getting the user: ${error}`)
        // }
    }
}

// getUserByEmail("manager@email.com").then(result => {
//     return console.log(result)
// })

// --------- CREATE ---------- //

export async function create(user) {
    return db.query(
        "INSERT INTO users (user_email, user_password, user_role, user_phone, user_firstname, user_lastname, user_address)" +
        "VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
            user.email,
            user.password,
            user.role,
            user.phone,
            user.firstname,
            user.lastname,
            user.address
        ]
    )
    .then(([result]) => {
        return { ...user, id: result.insertId }  // return an object with the user fields plus the inserted ID as the id
    })
}

// --- TESTING --- //

// create(
//     {
//         email: "Joe@email.com",
//         password: "123",
//         role: "trainer",
//         phone: "12345",
//         firstname: "Joe",
//         lastname: "Blogs",
//         address: "Someplace"
//     }
// )

// --- END TESTING --- //