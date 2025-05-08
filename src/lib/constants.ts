
// For simplicity in this example, the password is read from an environment variable.
// In a real application, ensure secure practices for managing secrets.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
export const ADMIN_AUTH_COOKIE_NAME = "admin-auth-token";

