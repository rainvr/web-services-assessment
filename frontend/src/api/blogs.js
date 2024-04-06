import { API_URL } from "./api.js";


// ---------- READ ---------- //

/**
 * GET /blogs
 * Gets all the blogs from the database
 * @param {String} authenticationKey
 * @returns {Promise<Array<Object>>}
 */
export async function getAll() {
    const apiResponse = await fetch(API_URL + "/blogs", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.blogs
}

// ---------- CREATE ---------- //

/**
 * POST /blogs
 * Posts a new blog to the database
 * @param {Object} blog
 * @param {String} authenticationKey
 * @returns {Promise<Array<Object>>}
 */
export async function create(blog, authenticationKey) {
    const apiResponse = await fetch(API_URL + "/blogs", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify(blog)
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject
}