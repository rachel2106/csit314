import { userEntity } from "./userEntity.js";

document.getElementById('userRegisterForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Collect form data
    const newUser = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        userEmail: document.getElementById('email').value.trim(),
        userPass: document.getElementById('createPassword').value,
        userType: document.querySelector('input[name="userType"]:checked') ? document.querySelector('input[name="userType"]:checked').value : ''
    };

    // Basic validation to check if all fields are filled
    if (!newUser.firstName || !newUser.lastName || !newUser.userEmail || !newUser.userPass || !newUser.userType) {
        alert("Please fill in all fields.");
        return;
    }

    const userEntityInstance = new userEntity();

    try {
        // Create user in Firebase and Firestore
        await userEntityInstance.createToDB(newUser);
        
        // Show success message and optionally redirect to login page
        alert("Registration successful!");
        // Uncomment the following line to redirect to the login page after successful registration
        // window.location.href = "loginPage.html";
    } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed. Please try again.");
    }
});
