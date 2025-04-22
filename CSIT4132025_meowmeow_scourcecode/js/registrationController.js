import { userEntity } from "./userEntity.js";

export class RegistrationController {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    }

    // Collect form data from the HTML
    collectFormData() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const userEmail = document.getElementById('email').value.trim();
        const userPass = document.getElementById('createPassword').value.trim();
        const userType = document.querySelector('input[name="userType"]:checked') ? 
                          document.querySelector('input[name="userType"]:checked').value : '';

        return { firstName, lastName, userEmail, userPass, userType };
    }

    // Basic validation to check if all fields are filled
    validateFields(data) {
        const { firstName, lastName, userEmail, userPass, userType } = data;
        if (!firstName || !lastName || !userEmail || !userPass || !userType) {
            alert("Please fill in all fields.");
            return false;
        }
        return true;
    }

    // Handle form submission
    async handleSubmit(event) {
        event.preventDefault();

        const formData = this.collectFormData();

        // Validate fields
        if (!this.validateFields(formData)) return;

        const userEntityInstance = new userEntity();

        try {
            // Create user in Firebase and Firestore
            await userEntityInstance.createToDB(formData);

            // Show success message and optionally redirect to login page
            alert("Registration successful!");
            // Uncomment the following line to redirect to the login page after successful registration
            // window.location.href = "loginPage.html";
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        }
    }
}
