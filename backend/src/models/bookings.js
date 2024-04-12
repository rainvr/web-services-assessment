import { db } from "../database.js"

// --------- CONSTRUCTOR ---------- //

// Construct a new booking object
export function newBooking(id, createDate, userId, trainerName, classId, classDatetime, activityName, activityDescription) {
    return {
        id,
        createDate,
        userId,
        classId,
        classDatetime,
        activityName,
        activityDescription,
        trainerName,
    }
}

// --------- READ ---------- //

// Get all the bookings from the database
export function getAll(userId) {
    // return db.query(`SELECT booking_id, booking_created_datetime, user_id, CONCAT(user_firstname, " ", user_lastname) AS trainer_name, class_id, class_datetime, activity_name, activity_description 
    // FROM bookings, users, classes, activities
    // WHERE bookings.booking_user_id = ? AND bookings.booking_class_id = classes.class_id AND classes.class_activity_id = activities.activity_id`, userId)
    return db.query(`
        SELECT 
            bookings.booking_id, 
            bookings.booking_created_datetime, 
            users.user_id, 
            classes.class_id, 
            classes.class_datetime,
            activities.activity_name,
            activities.activity_description,
            CONCAT(trainer.user_firstname, ' ', trainer.user_lastname) AS trainer_name
        FROM 
            bookings
            INNER JOIN users ON bookings.booking_user_id = users.user_id
            INNER JOIN classes ON bookings.booking_class_id = classes.class_id
            INNER JOIN activities ON classes.class_activity_id = activities.activity_id
            INNER JOIN users AS trainer ON classes.class_trainer_user_id = trainer.user_id
        WHERE 
            bookings.booking_user_id = ?
        `, userId)    
        .then((([queryResult]) => {
            return queryResult.map(
                result => newBooking(
                    result.booking_id, 
                    result.booking_created_datetime, 
                    result.user_id, 
                    result.class_id, 
                    result.class_datetime, 
                    result.activity_name, 
                    result.activity_description,
                    result.trainer_name
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting all the bookings: ` + error)
        })
}


// --------- CREATE ---------- //

export async function create(booking) {
    delete booking.id

    return db.query(
        "INSERT INTO bookings (booking_user_id, booking_class_id, booking_created_datetime)" +
        "VALUES (?, ?, ?)",
        [
            booking.userId,
            booking.classId,
            booking.createDate
        ]
    )
    .then(([result]) => {
        return { ...booking, id: result.insertId }  // return an object with the booking fields plus the inserted ID as the id
    })
}


// --------- DELETE ---------- //
// Delete the user by ID
export async function deleteById(bookingId) {
    return db.query("DELETE FROM bookings WHERE booking_id = ?", bookingId)
}