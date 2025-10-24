# 🎬 WatchParty Frontend

Welcome to the frontend repository for the **WatchParty** application! This is a modern Single-Page Application (SPA) built with React and Vite, providing users with an intuitive and responsive interface for a shared video-watching experience.

## ✨ Key Features

*   🎨 **Modern UI**: A clean and responsive design that ensures a great user experience on all devices.
*   🔐 **User Authentication**: Secure user registration and login with JWT-based session management.
*   👤 **User Dashboard**: A dedicated account page where users can view and edit their profile information (name, username, bio) and update their avatar.
*   🚪 **Room System**: Intuitive pages for creating new rooms, browsing a list of active rooms, and joining them.
*   💬 **Real-time Chat**: An integrated chat component that allows participants to communicate within a room.
*   🛡️ **Protected Routes**: Access to personal pages, such as the account dashboard, is restricted to authenticated users.
*   🔔 **Notification System**: Custom toast notifications to provide users with clear feedback on their actions.

## 🛠️ Technology Stack

*   **Framework**: [React 18](https://reactjs.org/)
*   **Build Tool & Dev Server**: [Vite](https://vitejs.dev/)
*   **Routing**: [React Router DOM](https://reactrouter.com/)
*   **State Management**: [React Context API](https://reactjs.org/docs/context.html) (for authentication and theme)
*   **Styling**: Plain CSS, likely using CSS Modules for component-level scope.
*   **HTTP Client**: The browser's native [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) for backend communication.

## 📂 Project Structure

The project follows a clear and scalable structure, organized by feature and responsibility.

```
WatchParty_Front/
├── public/               # Static assets
├── src/                  # Main application source code
│   ├── assets/           # Images, icons, fonts
│   ├── components/       # Reusable UI components (Header, Toast, Chat)
│   ├── contexts/         # React Context providers (AuthContext, ThemeContext)
│   ├── pages/            # Page-level components (HomePage, AccountPage, RoomsPage)
│   ├── App.jsx           # Main app component with routing setup
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── .env.local            # Local environment variables (must be created)
├── package.json          # Project dependencies and scripts
└── README.md             # This documentation file
```

---

## 🚀 Getting Started

Follow these steps to set up and run the project locally for development.

### 1. Prerequisites

Ensure you have the following software installed on your machine:
*   [Node.js](https://nodejs.org/) (LTS version is recommended)
*   [npm](https://www.npmjs.com/) (installed with Node.js)

### 2. Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Karimkhanov/WatchParty_Front.git
    cd WatchParty_Front
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### 3. Environment Configuration

To enable the frontend to communicate with your backend server, you must specify its address.

1.  In the project's root directory (`WatchParty_Front/`), create a new file named `.env.local`.

2.  Open this file and add the following line:

    ```env
    VITE_API_URL=http://localhost:5000
    ```

    *   `VITE_API_URL` is the environment variable that holds your backend's address.
    *   `http://localhost:5000` is the default URL for the locally running backend. If your backend is on a different port, change `5000` accordingly.

    > **Important**: The `VITE_` prefix is mandatory for Vite to expose the environment variable to your frontend code.

### 4. Running the Application

1.  **Make sure your backend server (W2G_Backend) is running!** The frontend will not function correctly without it.

2.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```

3.  Open your browser and navigate to the URL provided by Vite in the console (usually [**http://localhost:5173**](http://localhost:5173)).

You should now see the WatchParty application's home page.

---

## 📜 Available Scripts

The `package.json` file defines the following scripts for you to use:

*   `npm run dev`
    Starts the application in development mode with Hot Module Replacement (HMR) enabled.

*   `npm run build`
    Bundles the application for production into the `dist/` folder.

*   `npm run preview`
    Starts a local server to preview the production build from the `dist/` folder.

## 🤝 Backend Interaction

This project is designed to work with the [**WatchParty API (W2G_Backend)**](https://github.com/Karimkhanov/WatchParty_Back/tree/main). All API requests for authentication, room data, and user profiles are sent to the URL defined in the `VITE_API_URL` environment variable.

Micro Frontend and Micro Back links:

[**WatchParty API (W2G_chat-service)**]([https://github.com/Karimkhanov/WatchParty_Back/tree/main](https://github.com/Arlan-Z/watchparty-nodejs-chat-service)).

[**WatchParty API (W2G_Room)**](https://github.com/Arlan-Z/watchparty-room)
