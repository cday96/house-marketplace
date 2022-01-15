import React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg"
import visibilityIcon from "../assets/svg/visibilityIcon.svg"

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

	return (
		<div>
			<div className="pageContainer">
				<header>
					<p className="pageHeader">Register!</p>
				</header>
				<main>
					<form>
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
							<button className="signUpButton">
								<ArrowRightIcon
									fill="#ffffff"
									width="34px"
									heigh="34px"
								/>
							</button>
						</div>
					</form>
					{/* Google OAuth Component goes here */}
					<Link classname="registerLink" to="/sign-in">
						Already Have an Account?
					</Link>
				</main>
			</div>
		</div>
	)
}

export default SignUp
