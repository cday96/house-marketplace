import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg"
import { ReactComponent as ExploreIcon } from "../assets/svg/exploreIcon.svg"
import { ReactComponent as PersonOutlineIcon } from "../assets/svg/personOutlineIcon.svg"

function Navbar() {
	const navigate = useNavigate()
	const location = useLocation()

	// Simple function to check if route match page currently on for conditional icon fill
	const pathMatchRoute = (route) => {
		if (route === location.pathname) {
			return true
		}
	}

	return (
		<footer className="navbar">
			<nav className="navbarNav">
				<ul className="navbarListItems">
					<li
						className="navbarListItem"
						onClick={() => navigate("/")}
					>
						<ExploreIcon
							fill={pathMatchRoute("/") ? "#9b111e" : "#8f8f8f"}
							width="36px"
							height="36px"
						/>
						<p
							className={
								pathMatchRoute("/")
									? "navbarListItemNameActive"
									: "navbarListName"
							}
						>
							Explore
						</p>
					</li>
					<li
						className="navbarListItem"
						onClick={() => navigate("/offers")}
					>
						<OfferIcon
							fill={
								pathMatchRoute("/offers")
									? "#9b111e"
									: "#8f8f8f"
							}
							width="36px"
							height="36px"
						/>
						<p
							className={
								pathMatchRoute("/offers")
									? "navbarListItemNameActive"
									: "navbarListName"
							}
						>
							Offers
						</p>
					</li>
					<li
						className="navbarListItem"
						onClick={() => navigate("/profile")}
					>
						<PersonOutlineIcon
							fill={
								pathMatchRoute("/profile")
									? "#9b111e"
									: "#8f8f8f"
							}
							width="36px"
							height="36px"
						/>
						<p
							className={
								pathMatchRoute("/profile")
									? "navbarListItemNameActive"
									: "navbarListName"
							}
						>
							Profile
						</p>
					</li>
				</ul>
			</nav>
		</footer>
	)
}

export default Navbar
