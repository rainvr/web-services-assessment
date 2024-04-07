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

// ---------- UPDATE ---------- //

/**
 * PATCH /blogs
 * Updates a blog post by its id in the database
 * @param {Object} blog
 * @param {String} authenticationKey
 * @returns {Promise<Array<Object>>}
 */
export async function update(blog, authenticationKey) {
    const apiResponse = await fetch(API_URL + "/blogs", {
        method: "PATCH",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify(blog)
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject
}

// ---------- DELETE ---------- //

/**
 * DELETE /blogs/:id
 * @param { String } blogId 
 * @returns {Promise<Object>}
 */
export async function deleteById(blogId, authenticationKey) {
    console.log(blogId)
    console.log(authenticationKey)

    const response = await fetch(API_URL + "/blogs/" + blogId, 
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