import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"
import OAuth from "../components/OAuth"

function SignUp() {
	const [showPassword, setShowPassword] = useState(false)
	// Create state object for form fields instead of state for each field individually
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	})
	// Destructure for use later
	const { name, email, password } = formData

	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			// can determine which attr in formData obj to update based on ref to target id
			// field id must match attr name you are targetting to update
			[e.target.id]: e.target.value,
		}))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		try {
			// Get the auth value
			const auth = getAuth()

			// Register the user and put the returned promise into userCredential
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)

			// Get user info from the promise for adding to Firestore db
			const user = userCredential.user

			updateProfile(auth.currentUser, {
				displayName: name,
			})

			// Copy formData state values (name/email/password) into an object so can create record to store in db
			const formDataCopy = { ...formData }

			// Do not want to store password in db
			delete formDataCopy.password

			// Set a timestamp
			formDataCopy.timestamp = serverTimestamp()

			// Add a new document in collection "users"
			await setDoc(doc(db, "users", user.uid), formDataCopy)

			// Redirect to homepage
			navigate("/")
		} catch (error) {
			// Use toast from ToastContainer in react-toastify library to emit error
			toast.error("Something Went Wrong")
		}
	}

	return (
		<div>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Register!</p>
				</header>
				<main>
					<form onSubmit={handleSubmit}>
						<input
							id="name"
							className="nameInput"
							type="text"
							placeholder="Name"
							value={name}
							onChange={handleChange}
						/>
						<input
							id="email"
							className="emailInput"
							type="email"
							placeholder="Email"
							value={email}
							onChange={handleChange}
						/>
						<div className="passwordInputDiv">
							<input
								id="password"
								className="passwordInput"
								type={showPassword ? "text" : "password"}
								placeholder="Password"
								value={password}
								onChange={handleChange}
							/>
							<img
								className="showPassword"
								src={visibilityIcon}
								alt="showPassword"
								onClick={() =>
									setShowPassword((prevState) => !prevState)
								}
							/>
						</div>
						<div className="signUpBar">
							<p className="signUpText">Sign Up</p>
							<button type="submit" className="signUpButton">
								<ArrowRightIcon
									fill="#ffffff"
									width="34px"
									heigh="34px"
								/>
							</button>
						</div>
					</form>
					<OAuth />
					<Link className="registerLink" to="/sign-in">
						Already Have an Account?
					</Link>
				</main>
			</div>
		</div>
	)
}

export default SignUp
