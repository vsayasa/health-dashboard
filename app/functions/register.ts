// =============================================================================

// NOTE: THIS IS ONLY USED WHEN DEPLOYED TO AZURE. FOR TESTING FUNCTIONS, 
// USE LOCALLY DEFINED API ENDPOINTS INSTEAD

// =============================================================================
import { app } from '@azure/functions';
import { usersContainer } from '../db';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;


app.http("register", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const body = await request.json();
      const { username, password, displayName } = body;

      // Validate input
      if (!username || !password) {
        return {
          status: 400,
          jsonBody: { success: false, error: "Username and password are required" },
        };
      }

      // Check if username already exists
      // NOTE: NoSQL doesn't enforce unique constraints, so we query first
      const { resources: existing } = await usersContainer.items
        .query({
          query: "SELECT * FROM c WHERE c.username = @username",
          parameters: [{ name: "@username", value: username.toLowerCase() }],
        })
        .fetchAll();

      if (existing.length > 0) {
        return {
          status: 409,
          jsonBody: { success: false, error: "Username already taken" },
        };
      }

      // HASH the password before storing
      // bcrypt.hash() generates a random salt and hashes the password
      // The result looks like: "$2b$10$Kq3xZm..." — this is what goes in the DB
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Create the user document — notice we store hashedPassword, NOT password
      const user = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username: username.toLowerCase(),
        password: hashedPassword, // HASHED — not the original password!
        displayName: displayName || username,
        bio: "",
        createdAt: new Date().toISOString(),
      };

      const { resource } = await usersContainer.items.create(user);

      // Return success (NEVER send password or hash back to the client)
      return {
        status: 201,
        jsonBody: {
          success: true,
          user: {
            id: resource.id,
            username: resource.username,
            displayName: resource.displayName,
            createdAt: resource.createdAt,
          },
        },
      };
    } catch (error) {
      context.log("Register error:", error.message);
      return {
        status: 500,
        jsonBody: { success: false, error: "Server error: " + error.message },
      };
    }
  },
});
