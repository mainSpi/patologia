// For simplicity in this example, the password is hardcoded.
// In a real application, use environment variables and more secure practices.
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
export const ADMIN_AUTH_COOKIE_NAME = "admin-auth-token";
