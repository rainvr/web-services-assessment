// --- The Blog Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import Blog from "../../common/components/Blog"
import * as Blogs from "../../api/blogs"
import { useAuthentication } from "../authentication"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"

function BlogPage() {
    const [user, login, logout, refresh] = useAuthentication()
    const navigate = useNavigate()
    const [blogs, setBlogs] = useState([])
    const [view, setView] = useState("every")
    const [create, setCreate] = useState("false")

    const [formData, setFormData] = useState({
        id: null,
        userId: null, // parseInt(user.id),  // TODO: this was how I had it before
        datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        title: "",
        content: ""
    })

    const fetchBlogs = async () => {
        try {
            const blogs = await Blogs.getAll()
            if (blogs) {  // If we have some users returned
                setBlogs(blogs)  // Set the users state as the users returned
            } else {
                console.log("No blogs returned")  
            }
        } catch (error) {
            console.error("Error fetching blogs:", error) 
        }
    }

    useEffect(() => {
        // Set the userId in the formData only after the user has been retrieved from useAuthentication
        if (user) {
            setFormData(prevFormData => ({
                ...prevFormData,
                userId: parseInt(user.id)
            }))
            fetchBlogs()
        }
    }, [user]) // Re-run the effect if user changes ( see 2nd wk 5&6 video 1:26:30 )

    async function handleSubmit(event) {
        try {
            event.preventDefault()
            // TODO: setStatusMessage("Updating...")

            // TODO: loading/registering spinner

            // alert(`The form has been submitted with details: ${formData}`)  // TODO: remove this?
            
            // TODO: add validation for all fields
            
            // Create the blog
            const result = await Blogs.create(formData, user.authenticationKey)
            
            if (result) {
                // Refresh the list of blogs
                const updatedBlogs = await Blogs.getAll();
                if (updatedBlogs) {
                    setBlogs(updatedBlogs);
                } else {
                    console.log("No blogs returned after creating a new post");
                }
                // Reset the form data
                setFormData({
                    id: null,
                    userId: parseInt(user.id),
                    datetime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    title: "",
                    content: ""
                });
                // Close the create form
                setCreate("false");
            } else {
                console.log("Failed to create a new post");
            }

            refresh()
            // setStatusMessage(result.message)  // TODO: Status Message
        } catch (error) {
            console.log(error)
        }
    } 

    return (
        <main className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            <Header />
            <section className="flex flex-col gap-4 flex-1 mx-auto p-4 overflow-y-auto">
                <h1 className="text-xl font-bold text-center">Blogs</h1>
                {/* ----- Set the nav based on if there is a logged in user and create has been clicked ----- */}
                {user && (
                    <nav className="flex justify-center mt-4">
                        <button className="btn btn-outline btn-info mx-2" onClick={() => setView("every")}>All Blogs</button>
                        <button className="btn btn-outline btn-success mx-2" onClick={() => setView("mine")}>My Blogs</button>
                        { create == "false" ? <button className="btn btn-outline btn-error mx-2" onClick={() => setCreate("true")}>Create</button> : null }
                        { create == "true" && <button className="btn btn-outline btn-error mx-2" onClick={() => setCreate("false")}>Close</button> }
                    </nav>
                )}
                {/* ----- Set the form based on if create = "true" ----- */}
                { create == "true" ? 
                    <form onSubmit={handleSubmit} className="card-body card mx-auto w-96 bg-base-100 shadow-xl shadow-grey-500">
                        <input className="text-lg font-bold"
                            type="text"
                            placeholder="Title"
                            value={formData.title} 
                            onChange={(event) => setFormData(existingData => { return { ...existingData, title: event.target.value } } )}
                        />
                        <input className="bg-slate-100 p-4 rounded-lg" 
                            type="text"
                            placeholder="Content"
                            value={formData.content} 
                            onChange={(event) => setFormData(existingData => { return { ...existingData, content: event.target.value } } )}
                        />
                        <div className="flex flex-row justify-end gap-2">
                            {user ? <button className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Edit</button> : null}  {/* TODO: create the EditBlogPage */}
                            {user ? <button className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200  active:bg-red-200">Delete</button> : null}  {/* TODO: create & use the deleteBlog model/controller */}
                            {user ? <button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200  active:bg-blue-200">Save</button> : null}  {/* TODO: create & use the deleteBlog model/controller */}
                        </div>
                    </form>
                : null }
                {/* ----- Set the display based on the view  ----- */}
                { view == "every" ? blogs.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)).map(thisBlog => 
                    <Blog 
                        key={thisBlog.id}
                        id={thisBlog.id}
                        userId={thisBlog.userId}
                        author={thisBlog.author}
                        datetime={thisBlog.datetime}
                        title={thisBlog.title}
                        content={thisBlog.content}
                    />
                ) : blogs.filter((thisBlog) => thisBlog.userId == user.id).sort((a, b) => new Date(b.datetime) - new Date(a.datetime)).map(thisBlog => 
                    <Blog 
                        key={thisBlog.id}
                        id={thisBlog.id}
                        userId={thisBlog.userId}
                        author={thisBlog.author}
                        datetime={thisBlog.datetime}
                        title={thisBlog.title}
                        content={thisBlog.content}
                    />
                )}
            </section>
            <Footer />
        </main>
    )
}

export default BlogPage