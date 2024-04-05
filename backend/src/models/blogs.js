import { db } from "../database.js";

// --------- CONSTRUCTOR ---------- //

// Construct a new blob object
export function newBlog(id, userId, author, datetime, title, content) {
    return {
        id,
        userId,
        author,
        datetime,
        title, 
        content
    }
}

// --------- READ ---------- //

// Get all the blogs from the database
export function getAll() {
    return db.query(`SELECT post_id, post_user_id, CONCAT(user_firstname, " ", user_lastname) AS post_author, post_datetime, post_title, post_content 
    FROM blog_posts, users
    WHERE blog_posts.post_user_id = users.user_id`)
        .then((([queryResult]) => {
            return queryResult.map(
                result => newBlog(
                    result.post_id,
                    result.post_user_id,
                    result.post_author,
                    result.post_datetime,
                    result.post_title,    
                    result.post_content
                )
            )
        }))
        .catch(error => {
            console.log(`Error getting all the blogs: ` + error)
        })
}

// Get a blog by their ID
export async function getById(blogId) {
    try {
        const [queryResult] = await db.query("SELECT * FROM blog_posts WHERE post_id = ?", blogId)
            if (queryResult.length > 0) {
                const blogResult = queryResult[0]
                return Promise.resolve(
                    newBlog(
                        blogResult.post_id.toString(),
                        blogResult.post_user_id,
                        blogResult.post_datetime,
                        blogResult.post_title,    
                        blogResult.post_content
                    )
                )
            } else {
                return Promise.resolve(null)
            }
    } catch (error) {
        return Promise.reject("Error getting the blog from their ID" + error)
    }
}
