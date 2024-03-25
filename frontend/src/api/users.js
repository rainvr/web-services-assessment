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
        header: {
            'Content-Type': "application/json"
            // TODO: include the X-AUTH-KEY
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.users
}