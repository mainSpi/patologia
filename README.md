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

3.  **Set Up Environment Variables (Optional but Recommended):**
    The application might use environment variables. For local development, you can create a `.env.local` file in the project root.
    One important variable is `NEXT_PUBLIC_BASE_URL`. If not set, it defaults to `http://localhost:9002` as configured in the `src/app/view/[id]/page.tsx` file.
    To customize this, create or edit `.env.local` and add:
    ```
    NEXT_PUBLIC_BASE_URL=http://your_desired_localhost_url:port
    ```
    For example, to stick with the default explicitly:
    ```
    NEXT_PUBLIC_BASE_URL=http://localhost:9002
    ```
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
*   `src/components/`: Houses reusable UI components, including ShadCN UI elements.
*   `src/ai/`: Includes Genkit AI flows, configurations, and related utilities.
*   `public/`: Stores static assets accessible directly via URL (e.g., images, `data/cards.json`).
*   `src/lib/`: Utility functions and libraries.
*   `src/hooks/`: Custom React hooks.
*   `src/types/`: TypeScript type definitions.

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

Happy coding!
