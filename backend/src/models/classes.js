import { db } from "../database.js"
import { addHours } from "date-fns"

// --------- CONSTRUCTOR ---------- //

// Construct a new class object
export function newClass(id, datetime, date, day, weekday, week, time, locationId, locationName, activityId, activityName, activityDescription, activityDuration, trainerId, trainerName) {
    return {
        id,
        datetime: addHours(new Date(datetime), 10),
        date,
        day,
        weekday,
        week,
        time,
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
    return db.query(`SELECT class_id, class_datetime, DATE_FORMAT(class_datetime, "%D %M") AS class_date, DATE_FORMAT(class_datetime, "%W") AS class_day, WEEKDAY(class_datetime) AS class_weekday, WEEK(class_datetime) AS class_week, class_time, location_id, location_name, activity_id, activity_name, activity_description, activity_duration, user_id AS trainer_id, CONCAT(user_firstname, " ", user_lastname) AS trainer_name 
    FROM classes, users, location, activities
    WHERE classes.class_trainer_user_id = users.user_id AND classes.class_location_id = location.location_id AND classes.class_activity_id = activities.activity_id`)
        .then((([queryResult]) => {
            return queryResult.map(
                result => newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_date,
                    result.class_day,
                    result.class_weekday,
                    result.class_week,
                    result.class_time,
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

// Get the classes for the next week from the database
export function getWeek(weekStartDate, locationId) {
    return db.query(`SELECT class_id, class_datetime, DATE_FORMAT(class_datetime, "%D %M") AS class_date, DATE_FORMAT(class_datetime, "%W") AS class_day, WEEKDAY(class_datetime) AS class_weekday, WEEK(class_datetime) AS class_week, class_time, location_id, location_name, activity_id, activity_name, activity_description, activity_duration, user_id AS trainer_id, CONCAT(user_firstname, " ", user_lastname) AS trainer_name 
    FROM classes, users, location, activities
    WHERE classes.class_trainer_user_id = users.user_id AND classes.class_location_id = location.location_id AND classes.class_activity_id = activities.activity_id AND classes.class_datetime >= ? AND classes.class_datetime < ? AND location_id = ?`, [weekStartDate, addHours(weekStartDate,168), locationId])
        .then((([queryResult]) => {
            return queryResult.map(
                result => newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_date,
                    result.class_day,
                    result.class_weekday,
                    result.class_week,
                    result.class_time,
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
            console.log(`Error getting the week of classes: ` + error)
        })
}
