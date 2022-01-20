import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from "../assets/svg/googleIcon.svg"

function OAuth() {
	const navigate = useNavigate()
	const location = useLocation()

	const handleGoogleClick = async () => {
		try {
			// Need to get the auth and create a provider for the signInWithPopup function
			const auth = getAuth()
			const provider = new GoogleAuthProvider()

			// signInWithPopup will return a result object that we can get the user from
			const result = await signInWithPopup(auth, provider)
			const user = result.user

			// Check if user reference exisits and if not add them to db
			const docRef = doc(db, "users", user.uid)

			// getDoc will return us an object we can reference against
			const docSnap = await getDoc(docRef)

			if (!docSnap.exists()) {
				await setDoc(doc(db, "users", user.uid), {
					name: user.displayName,
					email: user.email,
					timestamp: serverTimestamp(),
				})
			}
			navigate("/")
		} catch (error) {
			toast.error("There Was an Issue Authenticating!")
		}
	}

	return (
		<div className="socialLogin">
			<p>Sign {location.pathname === "/sign-up" ? "Up" : "In"} with</p>
			<button className="socialIconDiv" onClick={handleGoogleClick}>
				<img
					className="socialIconImg"
					src={googleIcon}
					alt="google icon"
				/>
			</button>
		</div>
	)
}

export default OAuth
