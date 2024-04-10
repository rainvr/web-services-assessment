import { API_URL } from "./api.js";

// ---------- READ ---------- //

/**
 * GET /locations
 * Gets all the locations from the database
 * @returns {Promise<Array<Object>>}
 */
export async function getAll() {
    const apiResponse = await fetch(API_URL + "/locations", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.locations
}
