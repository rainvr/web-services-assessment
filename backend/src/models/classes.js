import { db } from "../database.js"
import { addHours } from "date-fns"

// --------- CONSTRUCTOR ---------- //

// Construct a new class object (used in XML upload)
export function newClass(id, datetime, locationId, activityId, trainerId) {
    return {
        id,
        datetime: addHours(new Date(datetime), 10),
        locationId,
        activityId,
        trainerId
    }
}

// Construct a new class object for the weekly view
export function newClassByWeek(date, locationId, activityId, activityName, activityDescription, activityDuration) {
    return {
        date,
        locationId,
        activityId,
        activityName,
        activityDescription,
        activityDuration
    }
}

// Construct a new class object for the create booking view
export function newClassByLDA(classId, classDatetime, classDay, classTime, locationId, locationName, activityId, activityName, activityDescription, activityDuration, trainerId, trainerName) {
    return {
        classId,
        classDatetime, 
        classDay,
        classTime,
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

// Construct a new class object for the trainer's classes view
export function newClassByUserId(classId, classDatetime, locationName, activityName, activityDuration, bookingCount) {
    return {
        classId,
        classDatetime, 
        locationName,
        activityName,
        activityDuration,
        bookingCount
    }
}

// --------- READ ---------- //

// Get the unique classes (by activity and day) for the next week from the database
export function getWeek(weekStartDate, locationId) {
    return db.query(`
        SELECT DISTINCT 
            DATE_FORMAT(class_datetime, "%Y-%m-%dT00:00:00.000Z") AS class_date, 
            class_location_id, 
            activity_id, 
            activity_name, 
            activity_description, 
            activity_duration 
        FROM classes, activities
        WHERE classes.class_activity_id = activities.activity_id 
            AND classes.class_datetime >= ? 
            AND classes.class_datetime < ? 
            AND class_location_id = ?`
    , [weekStartDate, addHours(weekStartDate,168), locationId])
        .then((([queryResult]) => {
            return queryResult.map(
                result => newClassByWeek(
                    result.class_date,
                    result.class_location_id,
                    result.activity_id,    
                    result.activity_name,
                    result.activity_description,
                    result.activity_duration
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting the week of classes: ` + error)
        })
}

// Get all the classes from the database by locationId, date and activityId
export function getByLDA(locationId, date, activityId) {
    return db.query(`
        SELECT 
            class_id, 
            class_datetime, 
            DATE_FORMAT(class_datetime, "%Y-%m-%d 00:00:00") AS class_day,
            DATE_FORMAT(class_datetime, "%l:%i %p") AS class_time,   
            location_id,
            location_name, 
            activity_id,
            activity_name, 
            activity_description, 
            activity_duration, 
            user_id AS trainer_id, 
            CONCAT(user_firstname, " ", user_lastname) AS trainer_name 
        FROM 
            classes, users, location, activities
        WHERE 
            classes.class_trainer_user_id = users.user_id 
            AND classes.class_location_id = location.location_id 
            AND classes.class_activity_id = activities.activity_id 
            AND location.location_id = ? 
            AND classes.class_datetime >= ?
            AND classes.class_datetime < ?
            AND activities.activity_id = ? 
    `, [locationId, date, addHours(date,24), activityId])
        .then((([queryResult]) => {
            return queryResult.map(
                result => newClassByLDA(
                    result.class_id,
                    result.class_datetime,
                    result.class_day,
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

// Get all the classes from the database by locationId, datetime and activityId
export function getByLTA(locationId, time, activityId) {
    return db.query(`
        SELECT * FROM classes
        WHERE 
            class_location_id = ? 
            AND class_datetime = ?
            AND class_activity_id = ? 
    `, [locationId, time, activityId])
        .then((([queryResult]) => {
            return queryResult.map(
                result => newClass(
                    result.class_id,
                    result.class_datetime,
                    result.class_location_id,
                    result.class_activity_id,    
                    result.class_trainer_id
                )
            )
        }))
        .catch(error => {
            console.log(`Error matching the class: ` + error)
        }) 
}

// Get all the classes by trainer user Id from today's date onward and count the bookings
export function getByUserId(userId) {
    return db.query(`
    SELECT 
        class_id,
        class_datetime,
        location_name,
        activity_name,
        activity_duration,
        COUNT(booking_id) AS booking_count
    FROM 
        classes
    JOIN 
        location ON classes.class_location_id = location.location_id 
    JOIN 
        activities ON classes.class_activity_id = activities.activity_id 
    LEFT JOIN 
        bookings ON class_id = booking_class_id
    WHERE class_trainer_user_id = ?  
        AND class_datetime >= CURRENT_DATE()
    GROUP BY 
        class_id, 
        class_datetime, 
        location_name, 
        activity_name, 
        activity_duration
    ORDER BY class_datetime
    `, userId)
        .then((([queryResult]) => {
            return queryResult.map(
                result => newClassByUserId(
                    result.class_id,
                    result.class_datetime,
                    result.location_name,
                    result.activity_name,   
                    result.activity_duration,
                    result.booking_count
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting the classes: ` + error)
        })
}

// --------- CREATE ---------- //

export async function create(clazz) {
    return db.query(
        "INSERT INTO classes (class_datetime, class_location_id, class_activity_id, class_trainer_user_id)" +
        "VALUES (?, ?, ?, ?)",
        [
            clazz.datetime,
            clazz.locationId,
            clazz.activityId,
            clazz.trainerId
        ]
    )
    .then(([result]) => {
        return { ...clazz, id: result.insertId }  // return an object with the class fields plus the inserted ID as the id
    })
}
