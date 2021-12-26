import "./App.css";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import PrivateRoute from "./utils/PrivateRoute";
import Footer from "./components/Footer";
import GamePage from "./pages/GamePage";
import MyQuestions from "./pages/MyQuestions";
import Leaderboard from "./pages/Leaderboard";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <AuthProvider>
      <Header />
      <div className="bodyContainer">
        <div className="app">
          <Routes>
            <Route path="/" element={<PrivateRoute />}>
              <Route path="" element={<HomePage />} />
            </Route>
            <Route path="/play" element={<GamePage />} />
            <Route path="/rankings" element={<Leaderboard />} />
            <Route path="/questions" element={<MyQuestions />} />
            <Route path="/profile/:profileId" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
