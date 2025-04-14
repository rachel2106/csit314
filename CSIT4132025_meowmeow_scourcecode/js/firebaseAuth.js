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

  const app = initializeApp(firebaseConfig);

  //Initialize cloud firestore and get a reference to the service
  const db = getFirestore(app);

  export const auth = getAuth(app);

  export default class Firebase {

    // Registration Function
    async registerUser(newUser) {
        try {
            // Create user in Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(
                auth, // Firebase auth instance
                newUser.userEmail,
                newUser.userPass
            );
            const user = userCredential.user;

            // Log the Firebase user
            console.log("User successfully created in Firebase Auth:", user.email);

            // Now, add the user to Firestore (excluding password)
            const usersData = collection(db, "csit314/AllUsers/UserData");
            const userDocRef = doc(usersData, user.email); // Use user email as the document ID

            // Save user data to Firestore
            await setDoc(userDocRef, {
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: user.email,
                password: newUser.userPass,
                userType: newUser.userType,
                userStatus: "Active",
            });

            console.log("User successfully added to Firestore:", user.email);
            alert("Registration successful!");

            //lead users back to login page
            window.location.href = "loginPage.html";

        } catch (error) {
            console.error("Error during registration:", error);
            alert("Registration failed. Please try again.");
        }
    }


    //Login for users
    async loginUser(email, password, selectedUserType) {
        try {
            // Sign in with Firebase Authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get user data from Firestore
            const usersData = collection(db, "csit314/AllUsers/UserData");
            const userDocRef = doc(usersData, user.email);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();

                // Validate account type
                if (userData.userType !== selectedUserType) {
                    return { success: false, message: `Incorrect account type. You registered as ${userData.userType}.` };
                }

                return { success: true, userData };
            } else {
                return { success: false, message: "User not found in Firestore." };
            }
        } catch (error) {
            console.error("Login failed:", error.message);
                // Handle Firebase auth error codes for better feedback
        let friendlyMessage;

        switch (error.code) {
            case "auth/wrong-password":
                friendlyMessage = "Incorrect password.";
                break;
            case "auth/user-not-found":
                friendlyMessage = "No account found with this email.";
                break;
            case "auth/invalid-email":
                friendlyMessage = "Invalid email format.";
                break;
            case "auth/invalid-credential":
                friendlyMessage = "Invalid email or password.";
                break;
            default:
                friendlyMessage = error.message; // fallback to raw Firebase error
        }
            
            return { success: false, message: error.message };
        }
    }


}
    







