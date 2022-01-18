import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getAuth } from "firebase/auth"

function Profile() {
	// Get the Authorizaed user
	const auth = getAuth()
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	})

	// Destructure for data
	const { name, email } = formData

	const navigate = useNavigate()

	// Sign the authorized user out
	const handleLogout = () => {
		auth.signOut()
		navigate("/")
	}

	return (
		<div className="profile">
			<header className="profileHeader">
				<p className="pageHeader">My Profile</p>
				<button className="logOut" type="button" onClick={handleLogout}>
					Logout
				</button>
			</header>
		</div>
	)
}

export default Profile
