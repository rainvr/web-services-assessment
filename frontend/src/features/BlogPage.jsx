// --- The Blog Page of the Application --- //
import Header from "../common/components/Header"
import Footer from "../common/components/Footer"
import Blog from "../common/components/Blog"

function BlogPage() {
    return (
        <main className="flex flex-col h-screen bg-slate-50 overflow-hidden">
            <Header />
            <section className="flex flex-col gap-4 flex-1 mx-auto p-4 overflow-y-scroll">
                 <h1 className="text-xl font-bold">Blogs</h1>  {/* TODO: align this to centre */}
                <Blog />
                <Blog />
                <Blog />
            </section>
            <Footer />
        </main>
    )
}

export default BlogPage