import { createContext, useContext, useEffect, useState } from "react"
import {
    login as apiLogin,
    logout as apiLogout,
    getByauthenticationKey
} from "../api/users"

// Export the global Authentication variable
export const AuthenticationContext = createContext(null)

export function AuthenticationProvider({ router, children }) {
    const [authenticatedUser, setAuthenticatedUser] = useState(null)

    // Handle case where the user is logged in and the page
    // is reloaded. Check localStorage to see if the authenticationKey
    // has been saved there, then attempt to load user by authenticationKey
    // to resume client side session. Redirect to root page if failed. 
    useEffect(() => {
        if (authenticatedUser == null) {  // if noone is logged in or the page was reloaded
            const authenticationKey = localStorage.getItem("authenticationKey")  // get the auth key from local storage
            if (authenticationKey) {  // if there is an auth key in local storage
                getByauthenticationKey(authenticationKey)  // retrieve the matching user object
                    .then(user => {
                        setAuthenticatedUser(user)
                    })
                    .catch(error => {
                        router.navigate("/")
                    })
            } else {
                router.navigate("/")  // if no auth key in local storage navagate home
            }
        }
    }, [])

    return <AuthenticationContext.Provider value={[authenticatedUser, setAuthenticatedUser]}> 
        {children}
    </AuthenticationContext.Provider>
}

// Create a custom hook to use the Auth Context global variable (useContext)
export function useAuthentication() {
    const [authenticatedUser, setAuthenticatedUser] = useContext(AuthenticationContext)

    async function login(email, password) {
        // Clear existing client side user record (i.e. logout if relogin)
        setAuthenticatedUser(null)
        // Attempt login and retrieve user if successful
        return apiLogin(email, password)  
            .then(result => {
                if (result.status == 200) {
                    // Store auth key in case page is reloaded
                    localStorage.setItem("authenticationKey", result.authenticationKey)
                    // Fetch logged in user from backend
                    return getByauthenticationKey(result.authenticationKey)
                        .then(user => {
                            setAuthenticatedUser(user)
                            return Promise.resolve(result.message)
                        })
                } else {
                    return Promise.reject(result.message)
                }
            }).catch(error => {
                return Promise.reject(error)
            })
    }

    async function logout() {
        localStorage.removeItem("authenticationKey")  // Clear auth key from local storage
        if (authenticatedUser) {  // if someone logged in on the front end
            return apiLogout(authenticatedUser.authenticationKey)  // logout on the backend
                .then(result => {
                    setAuthenticatedUser(null)  // on the frontend set Auth user to null
                    return Promise.resolve(result.message)
                })
        }
    }

    // reload a users data in the frontend if backend is updated
    async function refresh() {
        if (authenticatedUser) {  // is someone logged in according to the frontend?
            return getByauthenticationKey(authenticatedUser.authenticationKey) // Get the user object from the backend
                .then(user => {
                    setAuthenticatedUser(user)  // set the frontend Auth user object the same as the backend
                    return Promise.resolve("user refreshed")
                })
        } else {
            return Promise.reject("user must be authenticated")
        }
    }

    // return an array of the auth user and functionality
    return [authenticatedUser, login, logout, refresh]
}