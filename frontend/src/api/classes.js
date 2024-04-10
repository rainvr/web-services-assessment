import { API_URL } from "./api.js";


// ---------- READ ---------- //

/**
 * GET /classes
 * Gets all the classes from the database
 * @returns {Promise<Array<Object>>}
 */
export async function getAll() {
    const apiResponse = await fetch(API_URL + "/classes", {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.classes
}

/**
 * GET /classes/weekly/:weekStartDate
 * Gets the week of classes, starting from the weekStartDate, from the database
 * @returns {Promise<Array<Object>>}
 */
export async function getWeek(weekStartDate, locationId) {
    const apiResponse = await fetch(API_URL + "/classes/weekly/" + locationId + "/" + weekStartDate, {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        }
    })

    const APIResponseObject = await apiResponse.json()

    return APIResponseObject.classes
}
