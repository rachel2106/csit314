import { userEntity } from "./userEntity.js";  // Import the UserEntity class
import { userAdminAllProfilesController } from "./userAdminAllProfilesController.js";  // Import to load profiles

class LoginController {
    constructor() {
        this.user = new userEntity();
        this.loginForm = document.getElementById("loginForm");
        this.errorMsg = document.getElementById("error-msg");

        if (!this.loginForm) {
            console.error("loginForm not found in DOM");
            return;
        }

        this.init();
    }

    init() {
        this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        this.loadUserTypes(); // Load user types dynamically on page load
    }

    // Load available user types dynamically from Firestore
    async loadUserTypes() {
    const controller = new userAdminAllProfilesController();
    const profiles = await controller.getAllProfiles();
    
    console.log("Loaded profiles:", profiles);

    const select = document.getElementById('userType');
    select.innerHTML = `<option value="" disabled selected>Select user type</option>`;

    // 👉 Create a Set to store unique user types
    const uniqueUserTypes = new Set();

    profiles.forEach(profile => {
        if (profile.userType) {
            uniqueUserTypes.add(profile.userType.trim()); // add unique userType
        }
    });

    // Now add only unique options to the dropdown
    uniqueUserTypes.forEach(userType => {
        const option = document.createElement('option');
        option.value = userType;
        option.textContent = userType.charAt(0).toUpperCase() + userType.slice(1);
        select.appendChild(option);
    });
}

    async handleLogin(e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const selectedType = document.getElementById("userType").value;

        this.errorMsg.innerText = "";

        if (!email || !password || !selectedType) {
            this.errorMsg.innerText = "Please fill in all fields.";
            return;
        }

        try {
            const result = await this.user.loginUser(email, password, selectedType);

            if (result.status === "success") {
                const userData = result.userData;
                alert ("Login "+ result.status +" Welcome " + userData.lastName)

                switch (userData.userType) {
                    case "userAdmin":
                        window.location.href = "userAdminPage.html";
                        break;
                    case "platformManager":
                        localStorage.setItem("loggedInUserEmail", userData.email); // or sessionStorage
                        window.location.href = "platformManagerPage.html";

                        break;
                    case "cleaners":
                        localStorage.setItem("loggedInUserEmail", userData.email); // or sessionStorage
                        window.location.href = "cleanerPage.html";
                        break;
                    case "homeowners":
                        localStorage.setItem("loggedInUserEmail", userData.email); // or sessionStorage
                        window.location.href = "homeownersPage.html";
                        break;
                    default:
                        this.errorMsg.innerText = "Unknown user type.";
                }
            } else {
                this.errorMsg.innerText = result.message || "Login failed.";
            }
        } catch (err) {
            console.error("Login error:", err.message);
            this.errorMsg.innerText = "Login failed. Please check your credentials and try again.";
        }
    }
}

// Initialize the login controller once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new LoginController();
});
