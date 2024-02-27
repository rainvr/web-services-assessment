import { useState } from "react";

export default function Login() {
    const [emailInput, setEmailInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")

    console.log(emailInput, passwordInput)

    function handleSubmit(event) {
        event.preventDefault()

        alert(`The form has been submitted with email: ${emailInput} and password: ${passwordInput}`)
    }

    return (
      <article className="h-screen bg-gray-50 flex flex-col justify-center items-center">
        <article className="bg-white border border-gray-300 w-80 py-8 flex items-center flex-col mb-3">
          <h1 className="bg-no-repeat instagram-logo"></h1>
          <form className="mt-8 w-64 flex flex-col">
              <input autofocus
                    className="text-xs w-full mb-2 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
                    id="email" placeholder="Phone number, username, or email" type="text" />
              <input autofocus
                    className="text-xs w-full mb-4 rounded border bg-gray-100 border-gray-300 px-2 py-2 focus:outline-none focus:border-gray-400 active:outline-none"
                    id="password" placeholder="Password" type="password" />
              <a className=" text-sm text-center bg-blue-300 text-white py-1 rounded font-medium">
                  Log In
              </a>
          </form>
          <div class="flex justify-evenly space-x-2 w-64 mt-4">
              <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
              <span className="flex-none uppercase text-xs text-gray-400 font-semibold">or</span>
              <span className="bg-gray-300 h-px flex-grow t-2 relative top-2"></span>
          </div>
          <a className="text-xs text-blue-900 mt-4 cursor-pointer -mb-4">Forgot password?</a>
        </article>
        <div className="bg-white border border-gray-300 text-center w-80 py-4">
          <span className="text-sm">Don't have an account?</span>
          <a className="text-blue-500 text-sm font-semibold">  Sign up</a>
        </div>
        <div className="mt-3 text-center">
          <span className="text-xs">Get the app</span>
          <div className="flex mt-3 space-x-2">
              <div className="bg-no-repeat apple-store-logo"></div>
              <div className="bg-no-repeat google-store-logo"></div>
          </div>
        </div>
      </article>
    )
}