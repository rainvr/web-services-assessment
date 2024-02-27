import { Link } from "react-router-dom"

function Blog() {
    return (
        <article className="card-body card mx-auto w-96 bg-base-100 shadow-xl shadow-grey-500">
            <div className="flex flex-row justify-between">
                <span className="font-semibold text-sky-600">fullName</span>  {/* TODO: import the full name of the blog owner */}
                <span className="font-semibold text-sky-600">date</span>   {/* TODO: import the date of the blog post */}
            </div>
            <h2 className="text-lg font-bold">Title of Blog</h2>  {/* TODO: import the title of the blog */}
            <p className="bg-slate-100 p-4 rounded-lg">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque minima porro laborum adipisci illum incidunt minus aperiam, facilis similique itaque!</p>
            <div className="flex flex-row justify-end gap-2"> {/* TODO: toggle visibility if the blog belong's to the user */}
                <Link className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200  active:bg-red-200" to="/edit-blog">Edit</Link>  {/* TODO: create the EditBlogPage */}
                <Link className="badge badge-outline font-semibold text-red-600 hover:bg-red-200 focus:bg-red-200  active:bg-red-200">Delete</Link>  {/* TODO: create & use the deleteBlog model/controller */}
            </div>
        </article>
    )
}

export default Blog