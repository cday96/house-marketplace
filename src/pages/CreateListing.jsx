import React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Spinner from "../components/Spinner"

function CreateListing() {
	// Get the Authorized user
	const auth = getAuth()

	const navigate = useNavigate()

	const [geolocationEnabled, setGeolocationEnabled] = useState(true)
	const [loading, setLoading] = useState(false)
	const [formData, setFormData] = useState({
		type: "rent",
		name: "",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		address: "",
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		images: {},
		latitude: 0,
		longitude: 0,
		userRef: auth.currentUser.uid,
	})

	// Destructure for use later
	const {
		type,
		name,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		address,
		offer,
		regularPrice,
		discountedPrice,
		images,
		latitude,
		longitude,
	} = formData

	// Create a mounted ref to avoid potential memory leak due to component unmounting before we get user id info
	// const isMounted = useRef(true)

	// useEffect(() => {
	// 	if (isMounted) {
	// 		onAuthStateChanged(auth, (user) => {
	// 			if (user) {
	// 				setFormData({ ...formData, userRef: user.uid })
	// 			} else {
	// 				navigate("sign-in")
	// 			}
	// 		})
	// 	}

	// 	return () => {
	// 		isMounted.current = false
	// 	}
	// }, [isMounted])

	const onMutate = (e) => {
		let boolean = null

		if (e.target.value === "true") {
			boolean = true
		}
		if (e.target.value === "false") {
			boolean = false
		}

		// Files
		if (e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				images: e.target.files,
			}))
		}
		// Text/Boolean/Numbers
		if (!e.target.files) {
			setFormData((prevState) => ({
				...prevState,
				[e.target.id]: boolean ?? e.target.value,
			}))
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log(formData)
	}

	if (loading) {
		return <Spinner />
	}

	return (
		<div className="profile">
			<header>
				<p className="pageHeader"></p>
			</header>
			<main>
				<form onSubmit={handleSubmit}>
					<label className="formLabel">Sell / Rent</label>
					<div className="formButtons">
						<button
							className={
								type === "sale"
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="type"
							value="sale"
							onClick={onMutate}
						>
							Sell
						</button>
						<button
							className={
								type === "rent"
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="type"
							value="rent"
							onClick={onMutate}
						>
							Rent
						</button>
					</div>
					<label className="formLabel">Name</label>
					<input
						className="formInputName"
						type="text"
						id="name"
						value={name}
						maxLength="32"
						minLength="10"
						required
						onChange={onMutate}
					/>
					<div className="formRooms flex">
						<div>
							<label className="formLabel">Bedrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bedrooms"
								value={bedrooms}
								max="5"
								min="1"
								required
								onChange={onMutate}
							/>
						</div>
						<div>
							<label className="formLabel">Bathrooms</label>
							<input
								className="formInputSmall"
								type="number"
								id="bathrooms"
								value={bathrooms}
								max="5"
								min="1"
								required
								onChange={onMutate}
							/>
						</div>
					</div>
					<label className="formLabel">Parking</label>
					<div className="formButtons">
						<button
							className={
								parking ? "formButtonActive" : "formButton"
							}
							type="button"
							id="parking"
							value={true}
							max="50"
							min="1"
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!parking && parking !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="parking"
							value={false}
							max="50"
							min="1"
							onClick={onMutate}
						>
							No
						</button>
					</div>
					<label className="formLabel">Furnished</label>
					<div className="formButtons">
						<button
							className={
								furnished ? "formButtonActive" : "formButton"
							}
							type="button"
							id="furnished"
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!furnished && furnished !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="furnished"
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>
					<label className="formLabel">Address</label>
					<textarea
						className="formInputAddress"
						type="text"
						id="address"
						value={address}
						required
						onChange={onMutate}
					/>
					{!geolocationEnabled && (
						<div className="formLatLng flex">
							<div>
								<label className="formLabel">Latitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="latitude"
									value={latitude}
									required
									onChange={onMutate}
								/>
							</div>
							<div>
								<label className="formLabel">Longitude</label>
								<input
									className="formInputSmall"
									type="number"
									id="longitude"
									value={longitude}
									required
									onChange={onMutate}
								/>
							</div>
						</div>
					)}
					<label className="formLabel">Offer</label>
					<div className="formButtons">
						<button
							className={
								offer ? "formButtonActive" : "formButton"
							}
							type="button"
							id="offer"
							value={true}
							onClick={onMutate}
						>
							Yes
						</button>
						<button
							className={
								!offer && offer !== null
									? "formButtonActive"
									: "formButton"
							}
							type="button"
							id="offer"
							value={false}
							onClick={onMutate}
						>
							No
						</button>
					</div>
					<label className="formLabel">Regular Price</label>
					<div className="formPriceDiv">
						<input
							className="formInputSmall"
							type="number"
							id="regularPrice"
							value={regularPrice}
							max="1000000000"
							min="1"
							required
							onChange={onMutate}
						/>
						{type === "rent" && (
							<p className="formPriceText">$ / Month</p>
						)}
					</div>
					{offer && (
						<div>
							<label className="formLabel">
								Discounted Price
							</label>
							<input
								className="formInputSmall"
								type="number"
								id="discountedPrice"
								value={discountedPrice}
								max="1000000000"
								min="1"
								required={offer}
								onChange={onMutate}
							/>
						</div>
					)}
					<label className="formLabel">Images</label>
					<p className="imagesInfo">
						The first image will be the featured image (max 5).
					</p>
					<input
						className="formInputFile"
						type="file"
						id="images"
						max="5"
						accept=".jpg,.png,.jpeg"
						multiple
						required
						onChange={onMutate}
					/>
					<button
						className="primaryButton createListingButton"
						type="submit"
					>
						Create Listing
					</button>
				</form>
			</main>
		</div>
	)
}

export default CreateListing
