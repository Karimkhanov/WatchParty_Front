import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import App from "./App.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import { ThemeProvider } from "./contexts/theme-context.jsx"
import store from "./store/store.js"
import "./index.css"
import { registerServiceWorker, setupInstallPrompt } from "./utils/pwa.js"

// Register service worker
registerServiceWorker()
setupInstallPrompt()

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
