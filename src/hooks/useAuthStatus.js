import React from "react"
import { useEffect, useState, useRef } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export const useAuthStatus = () => {
	const [loggedIn, setLoggedIn] = useState(false)
	const [checkingStatus, setCheckingStatus] = useState(true)

	// Create a reference variable to avoid potential memory leak due to async nature of checking user auth state
	const isMounted = useRef(true)

	useEffect(() => {
		if (isMounted) {
			// Get the authorized user
			const auth = getAuth()
			// Use onAuthStateChanged to check if there is now a user object after auth state change (trigger by login/logout)
			onAuthStateChanged(auth, (user) => {
				if (user) {
					// if there is a user object then they are logged in and can set the state to reflect that
					setLoggedIn(true)
				}
				// If logged in we can change checkingStatus to false
				setCheckingStatus(false)
			})
		}
		// After running the auth check is safe to set to false and return
		return () => {
			isMounted.current = false
		}
	}, [isMounted])

	// Want to return the stat for loggedIn and CheckingStatus to use in the PrivateRoute Component
	return { loggedIn, checkingStatus }
}
