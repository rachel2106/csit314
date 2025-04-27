import Firebase from './firebaseAuth.js'; // Import the Firebase class

export class userAdminUpdateAccController {
    async updateUserAccount({ originalEmail, firstName, lastName, newEmail, password }) {
        // Validate input fields
        if (!originalEmail || !firstName || !lastName || !newEmail || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            // Instantiate the Firebase class
            const firebaseInstance = new Firebase();

            // Call the updateUserInFirestore method from the Firebase instance
            const result = await firebaseInstance.updateUserInFirestore(originalEmail, firstName, lastName, newEmail, password);

            // Handle the result of the update
            if (result.status === 'success') {
                alert(result.message); // Successful update
                return;
            }

            // If an error occurred in the Firestore update
            alert(result.message); // Show error message

        } catch (error) {
            // If an unexpected error occurs
            alert("Error updating user: " + error.message);
        }
    }
}
