import { userEntity } from "./userEntity.js";
import { userAdminAllProfilesController } from "./userAdminAllProfilesController.js"; // 🆕 Import to load profiles

export class RegistrationController {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.form.addEventListener('submit', (event) => this.handleSubmit(event));

        this.loadProfileOptions(); // 🆕 Load available profiles when the page loads
    }

    // Load all userType profiles dynamically from Firestore
    async loadProfileOptions() {
        const controller = new userAdminAllProfilesController();
        const profiles = await controller.getAllProfiles();

        const select = document.getElementById('userType');
        select.innerHTML = `<option value="" disabled selected>Select your profile</option>`; // Reset first

        const userTypeSet = new Set(); // To avoid duplicates

        profiles.forEach(profile => {
            if (profile.userType && !userTypeSet.has(profile.userType)) {
                userTypeSet.add(profile.userType);
                const option = document.createElement('option');
                option.value = profile.userType;
                option.textContent = profile.userType.charAt(0).toUpperCase() + profile.userType.slice(1);
                select.appendChild(option);
            }
        });
    }

    // Collect form data from the HTML
    collectFormData() {
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const userEmail = document.getElementById('email').value.trim();
        const userPass = document.getElementById('createPassword').value.trim();
        const userType = document.getElementById('userType').value; // 🆕 Updated here

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
    
        // Check if the selected userType is userAdmin or Platform Manager
        if (formData.userType === 'userAdmin' || formData.userType === 'platformManager') {
            alert("You are not allowed to register as a User Admin or Platform Manager.");
            return;  // Prevent registration for these user types
        }
    
        const userEntityInstance = new userEntity();
    
        try {
            // Create user in Firebase and Firestore
            await userEntityInstance.createToDB(formData);
    
            alert("Registration successful!");
    
            // Redirect to login page or any other page you want after registration
            window.location.href = "loginPage.html";  // You can change this to the desired page
        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again.");
        }
    }
    
}
