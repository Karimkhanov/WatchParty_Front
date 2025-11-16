import { Routes, Route } from "react-router-dom"
import HomePage from "./pages/home-page"
import RoomsPage from "./pages/rooms-page"
import AboutPage from "./pages/about-page"
import AuthPage from "./pages/auth-page"
import AccountPage from "./pages/account-page"
import RoomDetailPage from "./pages/room-detail-page"
import ResetPasswordPage from "./pages/reset-password-page"
import Header from "./components/header"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/room/:roomId" element={<RoomDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/account" element={<AccountPage />} />
          </Route>

          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
