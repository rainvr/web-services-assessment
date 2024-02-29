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

getAllUsers().then(result => {
    return console.log(result)
})