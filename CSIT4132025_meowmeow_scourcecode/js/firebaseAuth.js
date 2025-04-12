import {initializeApp} from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';

import {getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    updateProfile
 } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

 import {getFirestore,
    collection,
    doc,
    setDoc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    add,
    query,
    where
 } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'


 const firebaseConfig = {
    apiKey: "AIzaSyDdXOWc5V451mFqdVVn0njYfUNLlEJNwzM",
    authDomain: "csit314meowmeow.firebaseapp.com",
    projectId: "csit314meowmeow",
    storageBucket: "csit314meowmeow.firebasestorage.com",
    messagingSenderId: "1071061611732",
    appId: "1:1071061611732:web:19e47778697d1056f43741",
    measurementId: "G-561HSJR7FB"
};

  const app = initializeApp (firebaseConfig)

  const db = getFirestore(app)

  export const auth = getAuth(app)

  export default class Firebase {

    // Registration Function
async registerUser(newUser) {
    try {
        // Check for duplicate user (email)
        const userQuery = query(
            collection(db, "csit314/AllUsers/UserData"), // Firestore path
            where("email", "==", newUser.userEmail) // Use newUser.userEmail instead of document.getElementById()
        );
        const queryResult = await getDocs(userQuery);

        let userExists = false;
        queryResult.forEach((doc) => {
            userExists = true; // Set flag if duplicate email is found
            console.log("Duplicate user found:", doc.id);
        });

        if (userExists) {
            alert("A user with this email already exists!");
            return; // Stop registration process
        }

        // Add new user to Firestore
        const usersData = collection(db, "csit314/AllUsers/UserData");
        const docRef = await addDoc(usersData, {
            firstName: newUser.firstName, // Use newUser properties
            lastName: newUser.lastName,
            email: newUser.userEmail,
            password: newUser.userPass,
            userType: newUser.userType,
            userStatus: "Active"
        });

        console.log(`User registered successfully with ID: ${docRef.id}`);
        alert("Registration successful!");
    } catch (error) {
        console.error("Error registering user:", error);
        alert("Registration failed. Please try again.");
    }
}

    
}