import { Link } from "react-router-dom"
import * as Blogs from "../../api/blogs"
import * as Users from "../../api/users"
import { useState } from "react"
import { useAuthentication } from "../../features/authentication"

function Blog({id, userId, author, datetime, title, content}) {
    const [user] = useAuthentication()
    const [view, setView] = useState("read")

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

    async function deleteBlog(blogId) { 
        try {       
            const result = await Blogs.deleteById(blogId, user.authenticationKey)
            console.log(result)
            location.reload()  // Reload the window after the blog was deleted (to display the resulting array of blogs)
        } catch (error) {
        console.error("Error deleting blog:", error)
        }
    }

    return (
        <form className="card-body card mx-auto w-96 bg-base-100 shadow-xl shadow-grey-500">
            <div className="flex flex-row justify-between">
                    <span className="font-semibold text-sky-600">{author}</span>  
                    <span className="font-semibold text-sky-600">{formatDatetime(datetime)}</span> 
            </div>
            {/* ----- Set the form for the read view ----- */}
            { view == "read" ? <>    
                <h2 className="text-lg font-bold">{title}</h2>  
                <p className="bg-slate-100 p-4 rounded-lg">{content}</p>
                <div className="flex flex-row justify-end gap-2"> {/* TODO: toggle visibility if the blog belong's to the user */}
                    { user && userId == user.id ? <button type="button" onClick={()=>setView("edit")} className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200 active:bg-orange-200">Edit</button> : null }  {/* TODO: create the EditBlogPage */}
                    { user && userId == user.id ? <button type="button" onClick={()=>deleteBlog(id)} className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200 active:bg-red-200">Delete</button> : null }  {/* TODO: create & use the deleteBlog model/controller */}
                </div>
            {/* ----- Set the form for the other views (i.e. "edit") ----- */}       
            </> : <> 
                <h2 className="text-lg font-bold">{title}</h2>  
                <p className="bg-slate-100 p-4 rounded-lg">{content}</p>
                <div className="flex flex-row justify-end gap-2"> {/* TODO: toggle visibility if the blog belong's to the user */}
                    { user && userId == user.id ? <button type="button" onClick={()=>setView("read")} className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200 active:bg-orange-200">Cancel</button> : null }  {/* TODO: create the EditBlogPage */}
                    { user && userId == user.id ? <button type="button" onClick={()=>editBlog(id)} className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200">Save</button> : null }  {/* TODO: create & use the deleteBlog model/controller */}
                </div>           
            </> } 
        </form>         
    )
}

export default Blog