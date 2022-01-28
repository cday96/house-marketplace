// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAKxAbjY9pp4oF8Hd9h9aIVqO2Xyg-JRI0",
	authDomain: "house-marketplace-app-2d8e8.firebaseapp.com",
	projectId: "house-marketplace-app-2d8e8",
	storageBucket: "house-marketplace-app-2d8e8.appspot.com",
	messagingSenderId: "976232843539",
	appId: "1:976232843539:web:93b641e256bca314b4b2e6",
}

// Initialize Firebase
initializeApp(firebaseConfig)
export const db = getFirestore()
