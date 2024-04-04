import { API_URL } from "./api.js";


// ---------- READ ---------- //

/**
 * GET /users
 * Gets all the users from the database (only for a logged in user)
 * @returns {Promise<Array<Users>>}
 */
export async function getAll(authenticationKey) {
    const apiResponse = await fetch(API_URL + "/users", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.users
}

/**
 * GET /users/:authenticationKey
 * @param { String } authenticationKey 
 * @returns {Promise<Object>}
 */
export async function getByauthenticationKey(authenticationKey) {
    const response = await fetch(API_URL + "/users/authentication/" + authenticationKey, 
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json"
            }
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject.user
}

/**
 * GET /users/:id
 * @param { String } userId 
 * @returns {Promise<Object>}
 */
export async function getById(userId, authenticationKey) {
    const response = await fetch(API_URL + "/users/edit/" + userId, 
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            }
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject.user
}


// ---------- CREATE ---------- //

/**
 *  POST /users  // TODO: do I need this api?
 * @param { Object } user 
 * @param { String } authenticationKey
 * @returns { Promise<Object> }
 */
export async function create(user, authenticationKey) {
    const response = await fetch(API_URL + "/users", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify({user})
    })

    const APIResponseObject = await response.json()

    return APIResponseObject
}

/**
 *  POST /users/register
 * @param { Object } user 
 * @returns {Promise<Object>}
 */
export async function register(user) {
    const response = await fetch(API_URL + "/users/register", 
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(user)
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject
}


// ---------- UPDATE ---------- //

/**
 *  POST /users/login
 * @param { String } email 
 * @param { String } password 
 * @returns {Promise<Object>}
 */
export async function login(email, password) {
    const response = await fetch(API_URL + "/users/login", 
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject
}

/**
 *  POST /users/logout
 * @param { String } authenticationKey 
 * @returns {Promise<Object>}
 */
export async function logout(authenticationKey) {
    const response = await fetch(API_URL + "/users/logout", 
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify({})
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject
}

// TODO: change to PATCH?
/**
 *  POST /users/update
 * @param { Object } user 
 * @returns {Promise<Object>}
 */
export async function update(user, authenticationKey) {

    const response = await fetch(API_URL + "/users/update", 
        {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            },
            body: JSON.stringify(user)
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject
}

// ---------- DELETE ---------- //

/**
 * DELETE /users/:id
 * @param { String } userId 
 * @returns {Promise<Object>}
 */
export async function deleteById(userId, authenticationKey) {
    const response = await fetch(API_URL + "/users/" + userId, 
        {
            method: "DELETE",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            }
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject
}