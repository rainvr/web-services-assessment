// --- The Blog Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import Blog from "./Blog"
import * as Blogs from "../../api/blogs"
import { useAuthentication } from "../authentication"
import { useState, useEffect } from "react"
import { unescape } from "validator"

function BlogPage() {
    const [user, login, logout, refresh] = useAuthentication()
    const [blogs, setBlogs] = useState([])
    const [view, setView] = useState("every")
    const [create, setCreate] = useState("false")
    const [statusMessage, setStatusMessage] = useState("")

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
                // unescape the title and content (to ensure readible content)
                const unEscapedBlogs = blogs.map(blog => {
                    blog.title = unescape(blog.title),
                    blog.content = unescape(blog.content)
                })
                setBlogs(blogs)  // Set the users state as the users returned
            } else {
                console.log("No blogs returned")  
            }
        } catch (error) {
            console.error("Error fetching blogs:", error) 
        }
    }

    const updateStatus = (message) => {
        setStatusMessage(message)
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
            
            // Create the blog
            const result = await Blogs.create(formData, user.authenticationKey)
            
            if (result) {
                // Refresh the list of blogs
                const updatedBlogs = await Blogs.getAll()
                if (updatedBlogs) {
                    // setStatusMessage("Success! Your blog is created")
                    setBlogs(updatedBlogs)
                } else {
                    console.log("No blogs returned after creating a new post")
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
                setCreate("false")
                setStatusMessage("Success! " + result.message)
            } else {
                console.log("Failed to create a new post")
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
                {/* ----- SELECT VIEW BUTTONS ----- */}
                {user && (
                    <nav className="flex justify-center mt-4">
                        <button className="btn btn-outline btn-info mx-2" onClick={() => setView("every")}>All Blogs</button>
                        <button className="btn btn-outline btn-success mx-2" onClick={() => setView("mine")}>My Blogs</button>
                        { create == "false" ? <button className="btn btn-outline btn-error mx-2" onClick={() => setCreate("true")}>Create</button> : null }
                        { create == "true" && <button className="btn btn-outline btn-error mx-2" onClick={() => setCreate("false")}>Close</button> }
                    </nav>
                )}

                {/* ---- NO BLOGS MESSAGE ---- */}
                { create != "true" && view != "every" && blogs.filter((thisBlog) => thisBlog.userId == user.id).length == 0 && <>
                    <div className="divider"></div>
                    <p className="text-md font-normal text-center">There are no blogs.</p>
                    <p className="text-md font-normal text-center">Please press "Create" to add a blog.</p>
                </> }
                {/* ---- STATUS MESSAGE ---- */}
                { statusMessage != "" &&
                    <div role="alert" className="alert mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>{statusMessage}</span>
                        <div>
                            <button onClick={()=>setStatusMessage("")} className="btn btn-sm btn-primary">Close</button>
                        </div>
                    </div>
                }

                {/* ----- CREATE FORM ----- */}
                { create == "true" ? 
                    <form onSubmit={handleSubmit} className="card-body card flex-grow-0 mx-auto w-80 sm:w-96 md:w-[500px] lg:w-[650px] bg-base-100 shadow-xl shadow-grey-500">
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
                        {user ? <button type="button" onClick={()=>setCreate("false")} className="badge badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Cancel</button> : null}  {/* TODO: create & use the deleteBlog model/controller */}
                            {user ? <button type="submit" className="badge badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200  active:bg-blue-200">Save</button> : null}  {/* TODO: create & use the deleteBlog model/controller */}
                        </div>
                    </form>
                : null }
                {/* ----- BLOGS LIST ----- */}
                { view == "every" ? blogs.sort((a, b) => new Date(b.datetime) - new Date(a.datetime)).map(thisBlog => 
                    <Blog 
                        key={thisBlog.id}
                        id={thisBlog.id}
                        userId={thisBlog.userId}
                        author={thisBlog.author}
                        datetime={thisBlog.datetime}
                        title={thisBlog.title}
                        content={thisBlog.content}
                        onRefresh={fetchBlogs}
                        onAction={updateStatus}
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
                        onRefresh={fetchBlogs}
                        onAction={updateStatus}
                    />
                )}
            </section>
            <Footer />
        </main>
    )
}

export default BlogPage