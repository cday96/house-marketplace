import React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { getAuth } from "firebase/auth"
import {
	ref,
	getStorage,
	getDownloadURL,
	uploadBytesResumable,
} from "firebase/storage"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { v4 as uuidv4 } from "uuid"
import Spinner from "../components/Spinner"

function EditListing() {
	// Get the Authorized user
	const auth = getAuth()

	const navigate = useNavigate()
	const params = useParams()

	const [geolocationEnabled, setGeolocationEnabled] = useState(false)
	const [loading, setLoading] = useState(false)
	const [listing, setListing] = useState(null)
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

	// Redirect if listing is not user's
	useEffect(() => {
		if (listing && listing.userRef !== auth.currentUser.uid) {
			navigate("/")
			toast.error("You Connot Edit Another User's Listings")
		}
	})

	// Fetch listing to edit and set form data to have listing data
	useEffect(() => {
		setLoading(true)
		const fetchListing = async () => {
			const docRef = doc(db, "listings", params.listingId)
			const docSnap = await getDoc(docRef)
			if (docSnap.exists()) {
				setListing(docSnap.data())
				setFormData({
					...docSnap.data(),
					address: docSnap.data().location,
				})
				setLoading(false)
			} else {
				navigate("/")
				toast.error("Listing Does Not Exist")
			}
		}

		fetchListing()
	}, [navigate, params.listingId])

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

	const handleSubmit = async (e) => {
		e.preventDefault()

		setLoading(true)

		if (discountedPrice >= regularPrice) {
			setLoading(false)
			toast.error("Discounted Price Must Be Less Than Regular Price")
			return
		}

		if (images.length > 6) {
			setLoading(false)
			toast.error("Max 5 Images Allowed")
			return
		}

		// Enable geolocating functionality
		let geolocation = {}
		let location

		if (geolocationEnabled) {
			const res = await fetch(
				`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
			)

			const data = await res.json()

			geolocation.lat = data.results[0]?.geometry.location.lat ?? 0
			geolocation.lng = data.results[0]?.geometry.location.lng ?? 0
			location =
				data.status === "ZERO_RESULTS"
					? undefined
					: data.results[0]?.formatted_address
			if (location === undefined || location.includes("undefined")) {
				setLoading(false)
				toast.error("Please Enter a Correct Address")
				return
			}
		} else {
			geolocation.lat = latitude
			geolocation.lng = longitude
		}

		// Store Images in Firebase
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				// First create and name a file to reference in storage
				const storage = getStorage()
				const fileName = `${auth.currentUser.uid}-${
					image.name
				}-${uuidv4()}`

				const storageRef = ref(storage, "images/" + fileName)

				// Second, create and upload task for the file in storage ref
				const uploadTask = uploadBytesResumable(storageRef, image)

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						// Observe state change events such as progress, pause, resume
						// Get task progress
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) *
							100
						console.log("Upload is " + progress + "% done")
						switch (snapshot.state) {
							case "paused":
								console.log("Upload puased")
								break
							case "running":
								console.log("Upload running")
								break
						}
					},
					(error) => {
						// Handle unsuccessful uploads with reject from our Promise
						reject(error)
					},
					() => {
						// Handle successful uploads with resolve from our Promise
						getDownloadURL(uploadTask.snapshot.ref).then(
							(downloadURL) => {
								resolve(downloadURL)
							}
						)
					}
				)
			})
		}

		// Call the storeImage function for each image uploaded
		const imageUrls = await Promise.all(
			[...images].map((image) => storeImage(image))
		).catch(() => {
			setLoading(false)
			toast.error("Images Could Not Be Uploaded")
			return
		})

		// Submit forData, images, and geolocation to db
		// Need to make copy of formData as we need to add some stuff to it
		const formDataCopy = {
			...formData,
			imageUrls,
			geolocation,
			timestamp: serverTimestamp(),
		}

		// Need to clean up formData field ids to match db fields for saving
		delete formDataCopy.images
		delete formDataCopy.address
		formDataCopy.location = address
		!formDataCopy.offer && delete formDataCopy.discountedPrice

		// Save updates of the doc to the db
		const docRef = doc(db, "listings", params.listingId)
		await updateDoc(docRef, formDataCopy)
		setLoading(false)
		toast.success("Listing Saved")
		navigate(`/category/${formDataCopy.type}/${docRef.id}`)
	}

	if (loading) {
		return <Spinner />
	}

	return (
		<div className="profile">
			<header>
				<p className="pageHeader">Edit Listing</p>
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
						Edit Listing
					</button>
				</form>
			</main>
		</div>
	)
}

export default EditListing
