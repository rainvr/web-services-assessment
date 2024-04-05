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

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const blogs = await Blogs.getAll(user.authenticationKey)
                if (blogs) {  // If we have some users returned
                    setBlogs(blogs)  // Set the users state as the users returned
                } else {
                    console.log("No blogs returned")  
                }
            } catch (error) {
                console.error("Error fetching blogs:", error) 
            }
        }
        fetchBlogs()
    }, [user.authenticationKey]) // Only re-run the effect if user changes ( see 2nd wk 5&6 video 1:26:30 )

    return (
        <main className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            <Header />
            <section className="flex flex-col gap-4 flex-1 mx-auto p-4 overflow-y-scroll">
                <h1 className="text-xl font-bold">Blogs</h1>  {/* TODO: align this to centre */}
                {blogs.map(thisBlog => 
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