import { userEntity } from "./userEntity.js";

document.addEventListener("DOMContentLoaded", () => {
    const user = new userEntity();
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        console.error("loginForm not found in DOM");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const selectedType = document.getElementById("userType").value;
        const errorMsg = document.getElementById("error-msg");
        errorMsg.innerText = "";

        if (!email || !password || !selectedType) {
            errorMsg.innerText = "Please fill in all fields.";
            return;
        }

        try {
            const result = await user.loginToDatabase(email, password, selectedType);

            if (result.status === "success") {
                const userData = result.userData;

                // Redirect based on user type
                switch (userData.userType) {
                    case "userAdmin":
                        window.location.href = "adminPage.html";
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
                        errorMsg.innerText = "Unknown user type.";
                }
            } else {
                errorMsg.innerText = result.message || "Login failed.";
            }
        } catch (err) {
            console.error("Login error:", err.message);
            errorMsg.innerText = "Login failed. Please check your credentials and try again.";
        }
    });
});
