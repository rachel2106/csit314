import { userEntity } from "./userEntity.js";

const user = new userEntity();

document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const selectedType = document.getElementById("userType").value;

    const errorMsg = document.getElementById("error-msg");
    try {
        const result = await user.loginToDatabase(email, password, selectedType);

        if (result.success) {
            const userData = result.userData;

            switch (userData.userType) {
                case "userAdmin":
                    window.location.href = "adminDashboard.html";
                    break;
                case "platformManager":
                    window.location.href = "platformManagerDashboard.html";
                    break;
                case "cleaners":
                    window.location.href = "cleanerPage.html";
                    break;
                case "homeowners":
                    window.location.href = "homeownersPage.html";
                    break;
                default:
                    window.location.href = "homepage.html";
            }
        } else {
            alert(result.message);
        }
    } catch (err) {
        console.log("Login error:", err.message);
        alert("Login failed. Please try again.");
    }
});
