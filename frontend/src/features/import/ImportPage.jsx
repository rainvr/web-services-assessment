// --- The Home Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useRef, useState } from "react"
import { useAuthentication } from "../authentication"
import { API_URL } from "../../api/api"

function ImportPage({ onUploadSuccess, disabled = false }) {
    // const [statusMessage, setStatusMessage] = useState()
    const [user] = useAuthentication()
    const [status, setStatus] = useState("")
    const [uploadUrl, setUploadUrl] = useState("/users/upload")  // TODO: add a button to set this accordingly and view the correct input

    // get the upload input element reference
    const uploadInputRef = useRef(null)

    function uploadFile(e) {
        e.preventDefault()

        // Select the first file that was picked
        const file = uploadInputRef.current.files[0]

        // Get the file using mulitpart form data and give it the correct filename
        const formData = new FormData()
        formData.append("xml-file", file)

        // Send the file to the backend
        fetch(API_URL + uploadUrl, {
            method: "POST",
            headers: {
                'X-AUTH-KEY': user.authenticationKey,
            },
            body: formData
        })
        .then(response => response.json())
        .then(APIResponse => {
            setStatus(APIResponse.message)

            // clear the selected file
            uploadInputRef.current.value = null

            // Notify of successful upload
            if (typeof onUploadSuccess === "function") {
                onUploadSuccess()
            }
        })
        .catch(error => {
            setStatus("Error: " + error)
        })
    }

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <h1 className="text-xl font-bold text-center">Import XML</h1>

                <div className="divider"></div>

                <h2 className="text-lg font-bold">Upload new Users</h2>
                <form onSubmit={uploadFile}>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">Select the XML file to upload</span>
                        </div>
                        <input 
                            type="file" 
                            ref={uploadInputRef} 
                            disabled={disabled}
                            className="file-input file-input-bordered file-input-success w-full max-w-xs"
                        />
                        <div className="label">
                            <span className="label-text-alt">{status}</span>
                        </div>
                        
                    </label>

                    <div className="divider"></div>

                    <h2 className="text-lg font-bold">Upload new Classes</h2>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">Select the XML file to upload</span>
                        </div>
                        <input 
                            type="file" 
                            // ref={uploadInputRef}  // TODO: need a second one of these
                            disabled={disabled}
                            className="file-input file-input-bordered file-input-success w-full max-w-xs"
                        />
                        <div className="label">
                            <span className="label-text-alt">{status}</span>
                        </div>
                    </label>

                    <div className="divider"></div>
                    <button  disabled={disabled} className="btn btn-primary">Upload</button>
                </form>

            </section>
            <Footer />
        </main>
    )
}

export default ImportPage