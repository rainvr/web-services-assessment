import { API_URL } from "./api.js";


// TODO: remove or change this as it conflicts with GET /users by authKey below
/**
 *  GET /users/
 * 
 * @returns {Promise<Array<Users>>}
 */
// export async function getAll() {
//     const apiResponse = await fetch(API_URL + "/users/", {
//         method: "GET",
//         headers: {
//             'Content-Type': "application/json"
//             // TODO: include the X-AUTH-KEY
//         }
//     })

//     const APIResponseObject = await apiResponse.json()

//     return APIResponseObject.users
// }

/**
 *  POST /users  // TODO: do I need this api?
 * @param { Object } user 
 * @param { String } authKey
 * @returns { Promise<Object> }
 */
export async function create(user, authKey) {
    const response = await fetch(API_URL + "/users", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authKey
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

/**
 * GET /users/
 * @param { String } authenticationKey 
 * @returns {Promise<Object>}
 */
export async function getByAuthKey(authenticationKey) {
    const response = await fetch(API_URL + "/users/", 
        {
            method: "GET",
            headers: {
                'Content-Type': "application/json",
                'X-AUTH-KEY': authenticationKey
            }
        })
        
    const APIResponseObject = await response.json()
    
    return APIResponseObject
}