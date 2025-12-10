import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />

        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <Login />}
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="w-full overflow-x-hidden">
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            className: "dark:bg-white dark:text-black bg-black text-white",
            style: {
              borderRadius: "12px",
              padding: "16px",
              fontSize: "16px",
              fontWeight: "500",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
              className: "dark:bg-white dark:text-black bg-black text-white",
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
              className: "dark:bg-white dark:text-black bg-black text-white",
            },
          }}
        />
      </div>
    </AuthProvider>
  );
}
