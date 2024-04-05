import { API_URL } from "./api.js";


// ---------- READ ---------- //

/**
 * GET /blogs
 * Gets all the blogs from the database
 * @param {String} authenticationKey
 * @returns {Promise<Array<Object>>}
 */
export async function getAll(authenticationKey) {
    const apiResponse = await fetch(API_URL + "/blogs", {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.blogs
}