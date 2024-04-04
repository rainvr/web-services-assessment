import { db } from "../database.js";

// --------- CONSTRUCTOR ---------- //

// Construct a new user object
export function newUser(id, email, password, role, phone, firstname, lastname, address, authenticationKey) {
    return {
        id,
        email,
        password,
        role, 
        phone,
        firstname,
        lastname,
        address,
        authenticationKey
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
export async function getById(userId) {
    try {
        const [queryResult] = await db.query("SELECT * FROM users WHERE user_id = ?", userId)
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
                // console.log(`Error - No users with user_id: ${userId}`)  // TODO: reinstate this?
                return Promise.resolve(null)
            }
    } catch (error) {
        return Promise.reject("Error getting the user from their ID" + error)
    }
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
export async function getByauthenticationKey(authenticationKey) {
    try {
        const [queryResult] = await db.query("SELECT * FROM users WHERE user_authentication_key = ?", authenticationKey)
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
            user.authenticationKey,
            user.id
        ]
    )
    .then(([result]) => {
        return {user}  // return an object with the user fields plus the inserted ID as the id
    })
}

// --------- DELETE ---------- //
// Delete the user by ID
export async function deleteById(userId) {
    return db.query("DELETE FROM users WHERE user_id = ?", userId)
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


// getByauthenticationKey("test").then(result => {
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
//         authenticationKey: "12345",
//         id: "99"
//     }
// ).then(result => {
//         return console.log(result)
//     })


// --- END TESTING --- //