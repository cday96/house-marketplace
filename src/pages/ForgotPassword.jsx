import React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { getAuth, sendPasswordResetEmail } from "firebase/auth"
import { toast } from "react-toastify"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"

function ForgotPassword() {
	const [email, setEmail] = useState("")

	const handleChange = (e) => setEmail(e.target.value)

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const auth = getAuth()
			await sendPasswordResetEmail(auth, email)
			toast.success("Reset Email Sent!")
		} catch (error) {
			toast.error("An Error Occured. Could Not Send Reset Email.")
		}
	}

	return (
		<div className="pageContainer">
			<header>
				<p className="pageHeader">Forgot Password</p>
			</header>
			<main>
				<form onSubmit={handleSubmit}>
					<input
						className="emailInput"
						id="email"
						type="email"
						value={email}
						placeholder="Email"
						onChange={handleChange}
					/>
					<Link to="/sign-in" className="forgotPasswordLink">
						Sign In
					</Link>
					<div className="signInBar">
						<div className="signInText">Send Reset Link</div>
						<button className="signInButton">
							<ArrowRightIcon
								fill="#ffffff"
								width="34px"
								heigh="34px"
							/>
						</button>
					</div>
				</form>
			</main>
		</div>
	)
}

export default ForgotPassword
