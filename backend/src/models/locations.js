import { db } from "../database.js"

// --------- CONSTRUCTOR ---------- //

// Construct a new location object
export function newLocation(id, name) {
    return {
        id,
        name
    }
}

// --------- READ ---------- //

// Get all the locations from the database
export function getAll() {
    return db.query(`SELECT location_id, location_name FROM location`)
        .then((([queryResult]) => {
            return queryResult.map(
                result => newLocation(
                    result.location_id,
                    result.location_name
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting the location: ` + error)
        })
}

// Get the location with the matching name
export function getByName(locationName) {
    return db.query(`SELECT location_id, location_name FROM location WHERE location_name = ?`, locationName)
        .then((([queryResult]) => {
            return queryResult.map(
                result => newLocation(
                    result.location_id,
                    result.location_name
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting the location: ` + error)
        })
}