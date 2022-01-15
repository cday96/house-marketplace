import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"

function SignIn() {
	const [showPassword, setShowPassword] = useState(false)
	// Create state object for form fields instead of state for each field individually
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	})
	// Destructure for use later
	const { email, password } = formData

	const navigate = useNavigate()

	const handleChange = (e) => {
		setFormData((prevState) => ({
			...prevState,
			// can determine which attr in formData obj to update based on ref to target id
			// field id must match attr name you are targetting to update
			[e.target.id]: e.target.value,
		}))
	}

	return (
		<div>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Welcome!</p>
				</header>
				<main>
					<form>
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
						<Link
							className="forgotPasswordLink"
							to="/forgot-password"
						>
							Forgot Password?
						</Link>
						<div className="signInBar">
							<p className="signInText">Sign In</p>
							<button className="signInButton">
								<ArrowRightIcon
									fill="#ffffff"
									width="34px"
									heigh="34px"
								/>
							</button>
						</div>
					</form>
					{/* Google OAuth Component goes here */}
					<Link classname="registerLink" to="/sign-up">
						Register
					</Link>
				</main>
			</div>
		</div>
	)
}

export default SignIn
