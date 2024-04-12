// --- The Register Page of the Application --- //
import Header from "../../common/components/Header"
import Footer from "../../common/components/Footer"
import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import * as Bookings from "../../api/bookings"
import { useAuthentication } from "../authentication"
import { format, formatISO9075 } from "date-fns"

export default function CreateBookingPage() {
    const navigate = useNavigate()  // TODO: remove this?
    const location = useLocation()

    const [statusMessage, setStatusMessage] = useState("")
    const [user, login, logout, refresh] = useAuthentication()
    // const { clazz } = props.location.state


    const [formData, setFormData] = useState({
        userId: user.id,
        classId: location.state.clazz.id,
        createDate: formatISO9075(new Date())
    })

    async function handleSubmit(event) {
        try {
            event.preventDefault()
            setStatusMessage("Booking...")

            // TODO: loading/registering spinner

            // alert(`The form has been submitted with details: ${formData}`)  // TODO: remove this?
            
            // TODO: add validation for all fields

            // Create the booking
            const result = await Bookings.create(formData, user.authenticationKey)
            setStatusMessage(result.message)

            // TODO: If the booking was successful, navigate to the user's bookings page
            // if (result.status === 200) {
            //     navigate("/bookings")
            // }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <main className="flex flex-col bg-slate-50 h-screen overflow-hidden">
            <Header />
            <section className="flex-1 mx-auto p-4 overflow-y-scroll">
                <form onSubmit={handleSubmit} className="card-body card w-96 bg-base-100 shadow-xl">
                    <h2 className="card-title justify-center mb-4">Book a Class</h2>
                    <h3 className="pl-4 font-semibold text-sky-400">{location.state.clazz.locationName}</h3>
                    <div className="flex flex-row justify-between w-full bg-slate-200 py-1 px-4 rounded-box ">
                        <h2 className="text-lg font-bold">{location.state.clazz.day}</h2>
                        <h3 className="text-md pt-1">{location.state.clazz.date}</h3>
                    </div>
                    <h3 className="pl-4"><strong>Class: </strong>{location.state.clazz.activityName}</h3>
                    <p className="pl-4"><strong>Duration: </strong>{location.state.clazz.activityDuration} minutes</p>
                    <p className="pl-4">{location.state.clazz.activityDescription}</p>
                    <h3 className="pl-4"><strong>Time: </strong>{format(location.state.clazz.datetime, 'h aaa')}</h3>
                    <p className="pl-4"><strong>Trainer: </strong>{location.state.clazz.trainerName}</p>

                    {/* <label className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            //name="class-id"
                            value={formData.classId}
                            onChange={(event) => setFormData({ ...formData, phone: event.target.value } )}
                            placeholder="Phone Number"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            // TODO: pattern ...  Checks the phone number pattern
                        />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid phone number</span>
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <input
                            type="text"
                            //name="address"
                            value={formData.address}
                            onChange={(event) => setFormData({ ...formData, address: event.target.value } )}
                            placeholder="Address"
                            className="peer input input-bordered w-full max-w-xs invalid:border-red-600 invalid:outline-red-600"
                            // TODO: pattern ...  Checks the address pattern
                        />
                        <span className="invisible ml-2 mt-[2px] peer-invalid:visible label-text-alt text-red-600">Please enter a valid Address</span>
                    </label> */}
                     {/* <button type="submit" className="btn btn-primary">Book</button> */}
                    {/* <p className="mx-auto">Go to your <Link to="/">Bookings</Link></p>  */}
                    <div className="divider"></div>
                    <div className="flex flex-row justify-end gap-2">
                        <span className="label-text-alt">{statusMessage}</span>
                        <button type="button" onClick={()=>navigate('/calendar')} className="badge badge-lg badge-outline font-semibold text-orange-600 hover:bg-orange-200 focus:bg-orange-200  active:bg-orange-200">Cancel</button>
                        <button type="submit" className="badge badge-lg badge-outline font-semibold text-blue-600 hover:bg-blue-200 focus:bg-blue-200  active:bg-blue-200">Book</button>
                        </div>
                    
                </form>
            </section>
            <Footer />
        </main>
    )
}