import { db } from "../database.js"

// --------- CONSTRUCTOR ---------- //

// Construct a new location object
export function newActivity(id, name) {
    return {
        id,
        name
    }
}

// --------- READ ---------- //

// Get the activity with the matching name
export function getByName(activityName) {
    return db.query(`SELECT activity_id, activity_name FROM activities WHERE activity_name = ?`, activityName)
        .then((([queryResult]) => {
            return queryResult.map(
                result => newActivity(
                    result.activity_id,
                    result.activity_name
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting the activity: ` + error)
        })
}