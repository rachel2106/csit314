
import { userEntity } from "./userEntity.js"; // Import the userEntity class

export class AdminSuspendUserController {
    
    async suspendUser(userEmail) {
        try {
            // Initialize the userEntity instance
            const userEntityInstance = new userEntity();

            // Call the deleteUser function in userEntity and wait for the result
            const result = await userEntityInstance.suspendUser(userEmail);
            
            console.log(`User deletion successful for email: ${userEmail}`);
            return result; // Return the success message
        } catch (error) {
            console.error(`Failed to delete user with email: ${userEmail}.`, error);
            throw error; // Propagate the error for higher-level handling
        }
    }
}
