import { db } from "../database.js";

// --------- CONSTRUCTOR ---------- //

// Construct a new class object
export function newClass(id, datetime, locationId, locationName, activityId, activityName, activityDescription, activityDuration, trainerId, trainerName) {
    return {
        id,
        datetime,
        locationId,
        locationName,
        activityId,
        activityName,
        activityDescription,
        activityDuration,
        trainerId,
        trainerName
    }
}

// --------- READ ---------- //

// Get all the classes from the database
export function getAll() {
    return db.query(`SELECT class_id, class_datetime, location_id, location_name, activity_id, activity_name, activity_description, activity_duration, user_id AS trainer_id, CONCAT(user_firstname, " ", user_lastname) AS trainer_name 
    FROM classes, users, location, activities
    WHERE classes.class_trainer_user_id = users.user_id AND classes.class_location_id = location.location_id AND classes.class_activity_id = activities.activity_id`)
        .then((([queryResult]) => {
            return queryResult.map(
                result => newClass(
                    result.class_id,
                    result.class_datetime,
                    result.location_id,
                    result.location_name,
                    result.activity_id,    
                    result.activity_name,
                    result.activity_description,
                    result.activity_duration,
                    result.trainer_id,
                    result.trainer_name
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting all the classes: ` + error)
        })
}
