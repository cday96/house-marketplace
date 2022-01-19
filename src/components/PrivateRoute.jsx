import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useAuthStatus } from "../hooks/useAuthStatus"
import Spinner from "../components/Spinner"

const PrivateRoute = () => {
	// Create a variable to use to determine what to return
	const { loggedIn, checkingStatus } = useAuthStatus()

	if (checkingStatus) {
		return <Spinner />
	}

	// Return to the protected route if logged in is true, else redirect them to the sign in page
	return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivateRoute
