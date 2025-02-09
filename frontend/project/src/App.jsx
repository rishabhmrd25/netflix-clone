import { useEffect, useContext, lazy, Suspense } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthContext";
import Loading from "./componets/Loading/Loading";
import Navbar from "./componets/Header/Navbar";
import NavbarWithoutUser from "./componets/Header/NavbarWithoutUser";

// Lazy loading for better performance
const Home = lazy(() => import("./Pages/Home"));
const SignIn = lazy(() => import("./Pages/SignIn"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const Welcome = lazy(() => import("./Pages/Welcome"));
const ErrorPage = lazy(() => import("./Pages/ErrorPage"));
const MoviePlayer = lazy(() => import("./Pages/MoviePlayer"));
const Subscription = lazy(() => import("./Pages/subscription")); // Added Subscription Page

function App() {
  const { token, setTokenFromStorage } = useContext(AuthContext);

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setTokenFromStorage(storedToken);
    }
  }, []);

  return (
    <div>
      {token ? <Navbar /> : <NavbarWithoutUser />}
      <Suspense fallback={<Loading />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={token ? <Navigate to="/home" /> : <Welcome />} />
          <Route path="/signin" element={token ? <Navigate to="/home" /> : <SignIn />} />
          <Route path="/signup" element={token ? <Navigate to="/home" /> : <SignUp />} />
          <Route path="/subscribe" element={<Subscription />} /> {/* New Subscription Route */}
          <Route path="/welcome" element={<Welcome />} />

          {/* Protected Routes */}
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route path="/player" element={<ProtectedRoute element={<MoviePlayer />} />} />

          {/* 404 Page */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const { token } = useContext(AuthContext);
  return token ? element : <Navigate to="/signin" />;
};

export default App;
