import { Link } from "react-router-dom"
import * as Blogs from "../../api/blogs"
import * as Users from "../../api/users"
import { useState } from "react"

function Blog({id, userId, author, datetime, title, content}) {

    // Format datetime to a more readable format
    function formatDatetime(datetimeString) {
        const date = new Date(datetimeString)  // convert the string to a js date
        // Options for formatting the date
        const options = {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
        // Return formatted date string using toLocaleDateString()
        return date.toLocaleDateString('en-GB', options)
    }

    return (
        <form className="card-body card mx-auto w-96 bg-base-100 shadow-xl shadow-grey-500">
            <div className="flex flex-row justify-between">
                <span className="font-semibold text-sky-600">{author}</span>  {/* TODO: import the full name of the blog owner */}
                <span className="font-semibold text-sky-600">{formatDatetime(datetime)}</span>   {/* TODO: import the date of the blog post */}
            </div>
            <h2 className="text-lg font-bold">{title}</h2>  
            <p className="bg-slate-100 p-4 rounded-lg">{content}</p>
            <div className="flex flex-row justify-end gap-2"> {/* TODO: toggle visibility if the blog belong's to the user */}
                <button className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200  active:bg-red-200">Edit</button>  {/* TODO: create the EditBlogPage */}
                <button className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200  active:bg-red-200">Delete</button>  {/* TODO: create & use the deleteBlog model/controller */}
            </div>
        </form>
    )
}

export default Blog