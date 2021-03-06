import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Explore from "./pages/Explore"
import Offers from "./pages/Offers"
import Category from "./pages/Category"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Listing from "./pages/Listing"
import Contact from "./pages/Contact"
import ForgotPassword from "./pages/ForgotPassword"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import PrivateRoute from "./components/PrivateRoute"

import Navbar from "./components/Navbar"

function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route path="/" element={<Explore />} />
					<Route path="/offers" element={<Offers />} />
					<Route
						path="/category/:categoryName"
						element={<Category />}
					/>
					<Route
						path="/category/:categoryName/:listingId"
						element={<Listing />}
					/>
					<Route path="/profile" element={<PrivateRoute />}>
						{/* Insert the desired Outlet Route inside the PrivateRoute Route*/}
						<Route path="/profile" element={<Profile />} />
					</Route>
					<Route path="/sign-in" element={<SignIn />} />
					<Route path="/sign-up" element={<SignUp />} />
					<Route path="/create-listing" element={<PrivateRoute />}>
						{/* Insert the desired Outlet Route inside the PrivateRoute Route*/}
						<Route
							path="/create-listing"
							element={<CreateListing />}
						/>
					</Route>
					<Route
						path="/edit-listing/:listingId"
						element={<PrivateRoute />}
					>
						{/* Insert the desired Outlet Route inside the PrivateRoute Route*/}
						<Route
							path="/edit-listing/:listingId"
							element={<EditListing />}
						/>
					</Route>
					<Route path="/contact/:landlordId" element={<Contact />} />
					<Route
						path="/forgot-password"
						element={<ForgotPassword />}
					/>
				</Routes>
				<Navbar />
			</Router>
			<ToastContainer />
		</div>
	)
}

export default App
