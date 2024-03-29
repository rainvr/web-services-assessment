// TODO: create api/users.js and api/api.js
import { API_URL } from "./api.js";

/**
 *  GET /users/
 * 
 * @returns {Promise<Array<Users>>}
 */
export async function getAll() {
    const apiResponse = await fetch(API_URL + "/users/", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
            // TODO: include the X-AUTH-KEY
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.users
}

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
export async function registerUser(user) {
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