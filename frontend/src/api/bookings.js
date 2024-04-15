import { API_URL } from "./api.js"

// ---------- CREATE ---------- //

/**
 *  POST /bookings 
 * @param { Object } booking 
 * @param { String } authenticationKey
 * @returns { Promise<Object> }
 */
export async function create(booking, authenticationKey) {
    const response = await fetch(API_URL + "/bookings/", {
        method: "POST",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        },
        body: JSON.stringify(booking)
    })

    const APIResponseObject = await response.json()
    
    return APIResponseObject
}


// ---------- READ ---------- //

/**
 * GET /bookings/:userId
 * Gets all the bookings for the user's ID
 * @param {Number} userId
 * @param { String } authenticationKey 
 * @returns {Promise<Array<Object>>}
 */
export async function getAll(userId, authenticationKey) {
    console.log(userId) // TODO: remove test
    console.log(authenticationKey) // TODO: remove test

    const apiResponse = await fetch(API_URL + "/bookings/" + userId, {
        method: "GET",
        headers: {
            'Content-Type': "application/json",
            'X-AUTH-KEY': authenticationKey
        }
    })

    console.log(apiResponse) // TODO: remove test

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.bookings
}

// ---------- DELETE ---------- //

/**
 * DELETE /bookings/:bookingId
 * @param { String } bookingId 
 * @param { String } authenticationKey 
 * @returns {Promise<Object>}
 */
export async function deleteById(bookingId, authenticationKey) {
    const response = await fetch(API_URL + "/bookings/" + bookingId, 
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