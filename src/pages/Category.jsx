import React from "react"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
	startAfter,
} from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import ListingItem from "../components/ListingItem"
import Spinner from "../components/Spinner"

function Category() {
	const [listings, setListings] = useState(null)
	const [loading, setLoading] = useState(true)
	const [lastFetchedListing, setLastFetchedListing] = useState(null)

	const params = useParams()

	useEffect(() => {
		const fetchListings = async () => {
			try {
				// Get reference to listings collection
				const listingsRef = collection(db, "listings")

				// Create query on collection with constructed with the where fn
				// Use params.categoryName because this is what called the param we want to use in App.js route
				const q = query(
					listingsRef,
					where("type", "==", params.categoryName),
					orderBy("timestamp", "desc"),
					limit(10)
				)

				// Execute query to get data with Doc snapshot
				const querySnap = await getDocs(q)

				// Get the last fetched listing for pagination to be used
				const lastVisible = querySnap.docs[querySnap.docs.length - 1]
				setLastFetchedListing(lastVisible)

				let listings = []

				// Populate the listings array with the data in the querySnap
				querySnap.forEach((doc) => {
					// console.log(doc.data())
					return listings.push({
						id: doc.id,
						data: doc.data(),
					})
				})
				// Set listings state to the listings array we pushed and set loading to false once complete
				setListings(listings)
				setLoading(false)
			} catch (error) {
				toast.error("Could Not Fetch Listings")
			}
		}
		fetchListings()
	}, [params.categoryName])

	// Pagination and load more
	const handleFetchMoreListings = async () => {
		try {
			// Get reference to listings collection
			const listingsRef = collection(db, "listings")

			// Create query on collection with constructed with the where fn
			// Use params.categoryName because this is what called the param we want to use in App.js route
			const q = query(
				listingsRef,
				where("type", "==", params.categoryName),
				orderBy("timestamp", "desc"),
				startAfter(lastFetchedListing),
				limit(10)
			)

			// Execute query to get data with Doc snapshot
			const querySnap = await getDocs(q)

			// Get the last fetched listing for pagination to be used
			const lastVisible = querySnap.docs[querySnap.docs.length - 1]
			setLastFetchedListing(lastVisible)

			let listings = []

			// Populate the listings array with the data in the querySnap
			querySnap.forEach((doc) => {
				// console.log(doc.data())
				return listings.push({
					id: doc.id,
					data: doc.data(),
				})
			})
			// Set listings state to spread across the prev listings array we pushed and set loading to false once complete
			setListings((prevState) => [...prevState, ...listings])
			setLoading(false)
		} catch (error) {
			toast.error("Could Not Fetch Listings")
		}
	}

	return (
		<div className="category">
			<header>
				<p className="pageHeader">
					{params.categoryName === "rent"
						? "Places for Rent"
						: "Places for Sale"}
				</p>
			</header>
			{loading ? (
				<Spinner />
			) : listings && listings.length > 0 ? (
				<div>
					<main>
						<ul className="categoryListings">
							{listings.map((listing) => (
								// ListingItem Component Goes Here
								<ListingItem
									key={listing.id}
									id={listing.id}
									listing={listing.data}
								/>
							))}
						</ul>
					</main>
					<br />
					<br />
					{lastFetchedListing && (
						<p
							className="loadMore"
							onClick={handleFetchMoreListings}
						>
							Load More
						</p>
					)}
				</div>
			) : (
				<p>No Listings for {params.categoryName}</p>
			)}
		</div>
	)
}

export default Category
