import { Link } from "react-router-dom"
import * as Blogs from "../../api/blogs"
import * as Users from "../../api/users"
import { useState } from "react"
import { useAuthentication } from "../authentication"
import { unescape } from "validator"

function Blog({id, userId, author, datetime, title, content, onRefresh}) {
    const [user, login, logout, refresh] = useAuthentication()
    const [view, setView] = useState("read")

    const [formData, setFormData] = useState({
        id: id,
        datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        title: unescape(title),
        content: unescape(content)
    })

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
            if (typeof onRefresh == "function") {
                onRefresh()  // tell the parent to re-fetch the blogs, triggering a page refresh
            }
        } catch (error) {
        console.error("Error deleting blog:", error)
        }
    }

    async function cancelEdit() {
        setFormData({
            id: id,
            datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
            title: title,
            content: content
        })
        setView("read")
    }

    async function handleSubmit(event) {
        try {
            event.preventDefault()

            // TODO: setStatusMessage("Updating...")

            // TODO: loading/registering spinner

            // alert(`The form has been submitted with details: ${formData}`)  // TODO: remove this?
            
            // TODO: add validation for all fields
            
            // Create the blog
            const result = await Blogs.update(formData, user.authenticationKey)
            
            if (result) {
                // TODO: do I need to Reset the form data ???
                // TODO: do I need to refresh the view?
            
                // Close the edit view
                setView("read");
            } else {
                console.log("Failed to edit the blog post");
            }

            refresh()
            // setStatusMessage(result.message)  // TODO: Status Message
        } catch (error) {
            console.log(error)
        }
    } 

    return (
        <form onSubmit={handleSubmit} className="card-body card flex-grow-0 mx-auto w-80 sm:w-96 md:w-[500px] lg:w-[650px] bg-base-100 shadow-xl shadow-grey-500">
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
            {/* ----- Set the form for the other view (i.e. "edit") ----- */}       
            </> : <> 
                <input className="text-lg font-bold"
                    type="text"
                    value={formData.title} 
                    onChange={(event) => setFormData(existingData => { return { ...existingData, title: event.target.value } } )}
                />  
                <input className="bg-slate-100 p-4 rounded-lg"
                    type="text"
                    value={formData.content} 
                    onChange={(event) => setFormData(existingData => { return { ...existingData, content: event.target.value } } )}
                />
                <div className="flex flex-row justify-end gap-2"> {/* TODO: toggle visibility if the blog belong's to the user */}
                    { user && userId == user.id ? <button type="button" onClick={()=>cancelEdit()} className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200 active:bg-orange-200">Cancel</button> : null }  {/* TODO: create the EditBlogPage */}
                    { user && userId == user.id ? <button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200 active:bg-blue-200">Save</button> : null }  {/* TODO: create & use the deleteBlog model/controller */}
                </div>           
            </> } 
        </form>         
    )
}

export default Blog