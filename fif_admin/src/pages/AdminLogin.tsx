import { useState } from "react";
import API from "../api/adminApi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await API.post("/auth/login", { email, password });

    if (res.data.user.role !== "admin") {
      alert("Not an admin");
      return;
    }

    localStorage.setItem("adminToken", res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl w-96 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-zinc-800"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-zinc-800"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-indigo-600 py-3 rounded font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}
