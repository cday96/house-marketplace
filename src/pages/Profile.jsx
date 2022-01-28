import React from "react"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate, Link } from "react-router-dom"
import { getAuth, updateProfile } from "firebase/auth"
import {
	doc,
	updateDoc,
	getDocs,
	collection,
	query,
	where,
	orderBy,
	deleteDoc,
} from "firebase/firestore"
import { db } from "../firebase.config"
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import ListingItem from "../components/ListingItem"

function Profile() {
	// Get the Authorized user
	const auth = getAuth()

	const [changeDetails, setChangeDetails] = useState(false)
	const [formData, setFormData] = useState({
		name: auth.currentUser.displayName,
		email: auth.currentUser.email,
	})
	const [listings, setListings] = useState(null)
	const [loading, setLoading] = useState(true)

	// Destructure for data
	const { name, email } = formData

	const navigate = useNavigate()

	// fetch the listings that match userRef field with logged in user
	useEffect(() => {
		const fetchUserListings = async () => {
			const listingsRef = collection(db, "listings")
			const q = query(
				listingsRef,
				where("userRef", "==", auth.currentUser.uid),
				orderBy("timestamp", "desc")
			)
			const querySnap = await getDocs(q)

			let listings = []

			querySnap.forEach((doc) => {
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})
			// console.log(listings)
			setListings(listings)
			setLoading(false)
		}

		fetchUserListings()
	}, [auth.currentUser.uid])

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

	const handleDelete = async (listingId) => {
		if (window.confirm("Confirm Deletion")) {
			await deleteDoc(doc(db, "listings", listingId))
			const updatedListings = listings.filter(
				(listing) => listing.id !== listingId
			)
			setListings(updatedListings)
			toast.success("Listing Has Been Deleted")
		}
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
				<Link className="createListing" to="/create-listing">
					<img src={homeIcon} alt="home icon" />
					<p>Sell or Rent Your Home</p>
					<img src={arrowRight} alt="arrow right" />
				</Link>

				{!loading && listings?.length > 0 && (
					<div>
						<p className="listingText">Your Listings</p>
						<ul className="listingsList">
							{listings.map(({ data, id }) => (
								<ListingItem
									key={id}
									listing={data}
									id={id}
									onDelete={() => handleDelete(id)}
								/>
							))}
						</ul>
					</div>
				)}
			</main>
		</div>
	)
}

export default Profile
