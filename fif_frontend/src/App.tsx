import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Auth";

export default function App() {
  return (
    <div className="w-full overflow-y-hidden overflow-x-hidden">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Login />} />
      </Routes>
    </div>
  );
}
