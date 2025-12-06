import { motion } from "framer-motion";
import { useState } from "react";

export default function Auth() {
  const [showRegister, setShowRegister] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

const API_URL = import.meta.env.VITE_BACKEND_API_URL;


  // Handle input changes
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // LOGIN FUNCTION
  const handleLogin = async (e: any) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();
    alert(data.message);

    if (res.ok) {
      localStorage.setItem("token", data.token);
    }
  };

  // REGISTER FUNCTION
  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="w-full overflow-x-hidden min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-10 border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-zinc-900 text-center mb-6">
          {showRegister ? "Create Account" : "Welcome Back"}
        </h1>

        <p className="text-center text-zinc-500 mb-8">
          {showRegister
            ? "Register to start using Fix-It-Flow"
            : "Login to continue using Fix-It-Flow"}
        </p>

        {/* LOGIN FORM */}
        {!showRegister && (
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="text-left">
              <label className="block text-zinc-700 mb-1 font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <div className="text-left">
              <label className="block text-zinc-700 mb-1 font-medium">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:bg-zinc-800 transition"
            >
              Login →
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {showRegister && (
          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="text-left">
              <label className="block text-zinc-700 mb-1 font-medium">First Name</label>
              <input
                name="firstName"
                type="text"
                placeholder="John"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <div className="text-left">
              <label className="block text-zinc-700 mb-1 font-medium">Last Name</label>
              <input
                name="lastName"
                type="text"
                placeholder="Doe"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <div className="text-left">
              <label className="block text-zinc-700 mb-1 font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <div className="text-left">
              <label className="block text-zinc-700 mb-1 font-medium">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <div className="text-left">
              <label className="block text-zinc-700 mb-1 font-medium">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                onChange={handleChange}
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:border-black transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl text-lg font-medium hover:bg-zinc-800 transition"
            >
              Create Account →
            </button>
          </form>
        )}

        {/* TOGGLE LOGIN / REGISTER */}
        <p className="text-center text-zinc-500 mt-6 text-sm">
          {showRegister ? (
            <>
              Already have an account?{" "}
              <button className="text-blue-600 hover:underline" onClick={() => setShowRegister(false)}>
                Login
              </button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button className="text-blue-600 hover:underline" onClick={() => setShowRegister(true)}>
                Register
              </button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}
