import React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getDoc, doc } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import { db } from "../firebase.config"
import Spinner from "../components/Spinner"
import shareIcon from "../assets/svg/shareIcon.svg"

function Listing() {
	const [listing, setListing] = useState(null)
	const [loading, setLoading] = useState(true)
	const [shareLinkCopied, setShareLinkCopied] = useState(false)

	const navigate = useNavigate()
	const params = useParams()
	const auth = getAuth()

	useEffect(() => {
		const fetchListing = async () => {
			const docRef = doc(db, "listings", params.listingId)
			const docSnap = await getDoc(docRef)

			if (docSnap.exists()) {
				setListing(docSnap.data())
				setLoading(false)
			}
		}

		fetchListing()
	}, [navigate, params.listingId])

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href)
		setShareLinkCopied(true)
		setTimeout(() => {
			setShareLinkCopied(false)
		}, 2000)
	}

	if (loading) {
		return <Spinner />
	}

	return (
		<div>
			<main>
				{/* Slider will go here */}
				<div className="shareIconDiv" onClick={handleShare}>
					<img src={shareIcon} alt="share icon" />
				</div>
				{shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
				<div className="listingDetails">
					<p className="listingName">
						{listing.name} - $
						{listing.offer
							? listing.discountedPrice
							: listing.regularPrice}
					</p>
					<p className="listingLocation">{listing.location}</p>
					<p className="listingType">
						For {listing.type === "rent" ? "Rent" : "Sale"}
					</p>
					{listing.offer && (
						<p className="discountPrice">
							${listing.regularPrice - listing.discountedPrice}{" "}
							Discount
						</p>
					)}
					<ul className="listingDetailsList">
						<li>
							{listing.bedrooms > 1
								? `${listing.bedrooms} Bedrooms`
								: "1 Bedroom"}
						</li>
						<li>
							{listing.bathrooms > 1
								? `${listing.bathrooms} Bathrooms`
								: "1 Bathroom"}
						</li>
						<li>{listing.parking && "Parking Spot"}</li>
						<li>{listing.furnished && "Furnished"}</li>
					</ul>
					<p className="listingLocationTitle">Location</p>
					{/* Map goes here */}

					{auth.currentUser?.uid !== listing.userRef && (
						<Link
							className="primaryButton"
							to={`/contact/${listing.userRef}?listingName=${listing.name}`}
						>
							Contact Owner
						</Link>
					)}
				</div>
			</main>
		</div>
	)
}

export default Listing
