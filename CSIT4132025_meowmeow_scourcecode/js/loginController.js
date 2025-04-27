import { userEntity } from "./userEntity.js";  // Import the UserEntity class

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

                switch (userData.userType) {
                    case "userAdmin":
                        window.location.href = "userAdminPage.html";
                        break;
                    case "platformManager":
                        window.location.href = "platformManagerPage.html";
                        break;
                    case "cleaners":
                        window.location.href = "cleanerPage.html";
                        break;
                    case "homeowners":
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
