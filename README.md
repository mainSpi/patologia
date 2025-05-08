# Card Explorer (Next.js Application)

This is a Next.js application designed for exploring and viewing SVS (ScanScope Virtual Slide) images associated with tagged cards. It was initiated as a starter project in Firebase Studio.

## Prerequisites

Before you begin, ensure you have the following installed on your Linux machine:

*   **Node.js**: Version 18.x or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager): This usually comes bundled with Node.js.
    Alternatively, you can use **yarn**.

You can verify your installations by running the following commands in your terminal:
```bash
node -v
npm -v
# or for yarn
yarn --version
```

## Getting Started

Follow these steps to get the application running locally:

1.  **Clone the Repository (if applicable) or Obtain Project Files:**
    If you have access to the project as a Git repository, clone it:
    ```bash
    git clone <repository_url>
    cd <project_directory_name>
    ```
    If you have the project files as a ZIP archive, extract them to a directory of your choice and navigate into that directory.

2.  **Install Dependencies:**
    Open your terminal in the project's root directory and install the necessary dependencies using npm:
    ```bash
    npm install
    ```
    Or, if you prefer using yarn:
    ```bash
    yarn install
    ```

3.  **Set Up Environment Variables:**
    For local development, you need to set up environment variables. Create a file named `.env.local` in the project root.
    
    Add the following line to your `.env.local` file to set the admin password:
    ```
    ADMIN_PASSWORD=your_secure_password_here
    ```
    Replace `your_secure_password_here` with a strong password of your choice. If this variable is not set, the application will default to `admin123`.

    If there's a `.env.example` file provided in the future, you can copy it to `.env.local` and modify the values accordingly:
    ```bash
    cp .env.example .env.local
    ```

4.  **Run the Development Server:**
    To start the Next.js application in development mode, execute the following command:
    ```bash
    npm run dev
    ```
    This command (defined in `package.json`) uses Turbopack and will start the application, typically on port `9002`.
    Open your web browser and navigate to `http://localhost:9002` (or the port specified if you changed it or if 9002 was occupied).

5.  **Run Genkit Development Server (Optional):**
    If you are developing or testing AI-related features that use Genkit, you will need to run the Genkit development server. This should typically be run in a separate terminal window:
    ```bash
    npm run genkit:dev
    ```
    For automatic reloading on changes to Genkit files:
    ```bash
    npm run genkit:watch
    ```

## Available Scripts

The `package.json` file contains several scripts for managing and developing the application:

*   `npm run dev`: Starts the Next.js development server with Turbopack on port 9002.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching.
*   `npm run build`: Compiles the application for production deployment.
*   `npm run start`: Starts a Next.js production server (requires a prior build).
*   `npm run lint`: Runs ESLint to check for code quality and style issues.
*   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.

## Project Structure Overview

*   `src/app/`: Contains the core application logic using Next.js App Router, including pages, layouts, and route handlers.
    *   `src/app/HomePageClient.tsx`: Client component handling interactivity for the main card listing page.
*   `src/components/`: Houses reusable UI components, including ShadCN UI elements.
*   `src/ai/`: Includes Genkit AI flows, configurations, and related utilities.
*   `public/`: Stores static assets accessible directly via URL.
    *   `public/data/cards/`: Contains individual JSON files, each representing a card (e.g., `some-card-id.json`).
*   `src/lib/`: Utility functions and libraries (e.g., `constants.ts` for admin password configuration).
*   `src/hooks/`: Custom React hooks.
*   `src/types/`: TypeScript type definitions.

## Card Data
Card data is stored as individual JSON files within the `public/data/cards/` directory. Each file (e.g., `slide-alpha-001.json`) contains the data for a single card, adhering to the `CardData` interface defined in `src/types/index.ts`. The application reads these files directly using Node.js `fs` module in Server Components and for build-time page generation.

## Admin Access
The application includes an admin section for managing cards. Access to this section is protected by a password.
The password can be configured using the `ADMIN_PASSWORD` environment variable in your `.env.local` file.
Example:
```
ADMIN_PASSWORD=your_secure_password_here
```
If not set, it defaults to `admin123`.

## Troubleshooting

*   **Port in use:** If port `9002` is already in use, the `npm run dev` command might fail or use an alternative port. Check the terminal output for the correct URL.
*   **Dependency issues:** Ensure Node.js and npm/yarn are up to date. If you encounter issues after pulling new changes, try removing `node_modules` and `package-lock.json` (or `yarn.lock`) and reinstalling dependencies:
    ```bash
    rm -rf node_modules package-lock.json
    npm install
    ```
    or
    ```bash
    rm -rf node_modules yarn.lock
    yarn install
    ```
*   **Card data errors:** If cards are not loading, ensure the JSON files in `public/data/cards/` are correctly formatted and accessible. Check server console logs for any `fs` related errors.
*   **Admin login issues:** Ensure the `ADMIN_PASSWORD` environment variable is correctly set in `.env.local` if you are using a custom password.

Happy coding!
