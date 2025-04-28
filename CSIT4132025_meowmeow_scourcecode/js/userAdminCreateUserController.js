
  import { userEntity } from "./userEntity.js"; // Import the userEntity class

export class AdminDeleteUserController {
    /**
     * Deletes a user by delegating to the userEntity class
     * @param {string} userEmail - The email of the user to delete
     * @returns {Promise<string>} - Message confirming deletion
     */
    async deleteUser(userEmail) {
        try {
            // Initialize the userEntity instance
            const userEntityInstance = new userEntity();

            // Call the deleteUser function in userEntity and wait for the result
            const result = await userEntityInstance.deleteUser(userEmail);
            
            console.log(`User deletion successful for email: ${userEmail}`);
            return result; // Return the success message
        } catch (error) {
            console.error(`Failed to delete user with email: ${userEmail}.`, error);
            throw error; // Propagate the error for higher-level handling
        }
    }
}
