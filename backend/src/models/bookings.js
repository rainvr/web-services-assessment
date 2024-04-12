import { db } from "../database.js"

// --------- CONSTRUCTOR ---------- //

// Construct a new booking object
export function newBooking(id, userId, classId, createDate) {
    return {
        id,
        userId,
        classId,
        createDate
    }
}

// --------- READ ---------- //

// Get all the bookings from the database
// export function getAll() {
//     return db.query(`SELECT location_id, location_name FROM location`)
//         .then((([queryResult]) => {
//             return queryResult.map(
//                 result => newLocation(
//                     result.location_id,
//                     result.location_name
//                 )
//             )
//         }))
//         .catch(error => {
//             console.log(`Error getting the location: ` + error)
//         })
// }


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