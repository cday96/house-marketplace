import React from "react"
import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate, Link } from "react-router-dom"
import { getAuth, updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase.config"

function Profile() {
	// Get the Authorized user
	const auth = getAuth()

	const [changeDetails, setChangeDetails] = useState(false)
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

	// Allow changing of formData state
	const handleChange = (e) => {
		e.preventDefault()
		setFormData((prevState) => ({
			...prevState,
			[e.target.id]: e.target.value,
		}))
	}

	// Send updated Profile name info to firebase
	const onSubmit = async () => {
		try {
			// Check a new name is being submitted before updating
			if (auth.currentUser.displayName !== name) {
				// Update the displayName in firebase
				await updateProfile(auth.currentUser, {
					displayName: name,
				})
				// Update in firestore too
				const userRef = doc(db, "users", auth.currentUser.uid)
				await updateDoc(userRef, {
					name: name,
				})
			}
		} catch (error) {
			toast.error("Could not update profile information")
		}
	}

	return (
		<div className="profile">
			<header className="profileHeader">
				<p className="pageHeader">My Profile</p>
				<button className="logOut" type="button" onClick={handleLogout}>
					Logout
				</button>
			</header>
			<main>
				<div className="profileDetailsHeader">
					<p className="profileDetailsText">Personal Details</p>
					<p
						className="changePersonalDetails"
						onClick={() => {
							changeDetails && onSubmit()
							setChangeDetails((prevState) => !prevState)
						}}
					>
						{changeDetails ? "Done" : "Change"}
					</p>
				</div>
				<div className="profileCard">
					<form>
						<input
							type="text"
							id="name"
							className={
								!changeDetails
									? "profileName"
									: "profileNameActive"
							}
							disabled={!changeDetails}
							value={name}
							onChange={handleChange}
						/>
						<input
							type="email"
							id="email"
							className={"profileEmail"}
							disabled={true}
							value={email}
						/>
					</form>
				</div>
			</main>
		</div>
	)
}

export default Profile
