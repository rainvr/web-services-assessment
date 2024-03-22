// TODO: create api/users.js and api/api.js
import { API_URL } from "./api.js";

// Get the logged in user
export async function login(email, password) {
    const response = await fetch(
        API_URL + "/login",
        {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })
        }
    )

    const APIResponseObject = await response.json()

    return APIResponseObject
}

/**
 *  GET /users/
 * 
 * @returns {Promise<Array<Users>>}
 */
export async function getAllUsers() {
    const apiResponse = await fetch(API_URL + "/users/", {
        method: "GET",
        header: {
            'Content-Type': "application/json"
            // TODO: include the X-AUTH-KEY
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.users
}

export async function getUserByEmail(userEmail) {
    const apiResponse = await fetch(API_URL + "/profile/" + userEmail,
    {
        method: "GET",
        header: {
            'Content-Type': "application/json"
            // TODO: include the X-AUTH-KEY
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.user
}