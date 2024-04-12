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