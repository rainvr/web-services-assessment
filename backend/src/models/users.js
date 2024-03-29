import { db } from "../database.js";

// --------- CONSTRUCTOR ---------- //

// Construct a new user object
export function newUser(id, email, password, role, phone, firstname, lastname, address, authKey) {
    return {
        id,
        email,
        password,
        role, 
        phone,
        firstname,
        lastname,
        address,
        authKey
    }
}

// --------- READ ---------- //

// Get all the users from the database
export function getAll() {
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
                    result.user_address,
                    result.user_authentication_key
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting all the users: ` + error)
        })
}

// Get a user by their ID
export function getById(userId) {
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
                        result.user_address,
                        result.user_authentication_key
                    )
                )
            } else {
                console.log(`Error - No users with user_id: ${userId}`)
                // return  TODO: do I need to return here?
            }
        }))
        .catch(error => {
            console.log(`Error getting the user: ${error}`)
        })
}

// Get a user by their email
export async function getByEmail(userEmail) {
    try {
        const [queryResult] = await db.query("SELECT * FROM users WHERE user_email = ?", userEmail)
        if (queryResult.length > 0) {
            const userResult = queryResult[0]
            return Promise.resolve(
                newUser(
                    userResult.user_id.toString(),
                    userResult.user_email,
                    userResult.user_password,
                    userResult.user_role,    
                    userResult.user_phone,
                    userResult.user_firstname,
                    userResult.user_lastname,
                    userResult.user_address,
                    userResult.user_authentication_key
                )
            )
        } else {
            return Promise.resolve(null)
        }
    } catch {
        return Promise.reject("Error getting the user from their email")
    }
}

// Get a user by their Authentication Key
export async function getByAuthKey(authKey) {
    try {
        const [queryResult] = await db.query("SELECT * FROM users WHERE user_authentication_key = ?", authKey)
        if (queryResult.length > 0) {
            const userResult = queryResult[0]
            return Promise.resolve(
                newUser(
                    userResult.user_id.toString(),
                    userResult.user_email,
                    userResult.user_password,
                    userResult.user_role,    
                    userResult.user_phone,
                    userResult.user_firstname,
                    userResult.user_lastname,
                    userResult.user_address,
                    userResult.user_authentication_key
                )
            )
        } else {
            return Promise.resolve(null)
        }
    } catch {
        return Promise.reject("Error getting the user")
    }
}


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


// --------- UPDATE ---------- //

export async function updateById(user) {
    return db.query(
        "UPDATE users SET "
        + "user_email = ?, "
        + "user_password = ?, "
        + "user_role = ?, "
        + "user_phone = ?, "
        + "user_firstname = ?, "
        + "user_lastname = ?, "
        + "user_address = ?, "
        + "user_authentication_key = ? "
        + "WHERE user_id = ?",
        [
            user.email,
            user.password,
            user.role,
            user.phone,
            user.firstname,
            user.lastname,
            user.address,
            user.authKey,
            user.id
        ]
    )
    .then(([result]) => {
        return {user}  // return an object with the user fields plus the inserted ID as the id
    })
}

// --- TESTING --- //
// TODO: remove testing area


// getAll().then(result => {
//     return console.log(result)
// })


// getById(2).then(result => {
//     return console.log(result)
// })


// getByEmail("manager@email.com").then(result => {
//     return console.log(result)
// })


// getByAuthKey("test").then(result => {
//     return console.log(result)
// })


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
// ).then(result => {
//     return console.log(result)
// })


// updateById(
//     {
//         email: "Jane@email.com",
//         password: "12356",
//         role: "manager",
//         phone: "12345",
//         firstname: "Joseph",
//         lastname: "Blogs",
//         address: "Someplace",
//         authKey: "12345",
//         id: "99"
//     }
// ).then(result => {
//         return console.log(result)
//     })


// --- END TESTING --- //