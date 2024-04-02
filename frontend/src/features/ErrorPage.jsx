import { useNavigate } from "react-router-dom";
import Footer from "../common/components/Footer";
import Header from "../common/components/Header";

export default function ErrorPage(heading, message) {
    const navigate = useNavigate()

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="text-4xl">{heading}</h2>
                <span className="text-xl">{message}</span>
                <button className="btn btn-lg" onClick={() => navigate(-1)}>Back</button>
            </div>
            <Footer />
        </main>
    )
}