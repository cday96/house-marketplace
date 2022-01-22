import React from "react"
import { Link } from "react-router-dom"
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg"
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg"

function Explore() {
	return (
		<div className="explore">
			<header>
				<p className="pageHeader"></p>
			</header>
			<main>
				{/* Slider will go here */}
				<p className="exploreCategoryHeading"></p>
				<div className="exploreCategories">
					<Link to="/category/rent">
						<img
							className="exploreCategoryImg"
							src={rentCategoryImage}
							alt="rentCategory"
						/>
						<p className="exploreCategoryName">Places for Rent</p>
					</Link>
					<Link to="/category/sale">
						<img
							className="exploreCategoryImg"
							src={sellCategoryImage}
							alt="sellCategory"
						/>
						<p className="exploreCategoryName">Places for Sale</p>
					</Link>
				</div>
			</main>
		</div>
	)
}

export default Explore
